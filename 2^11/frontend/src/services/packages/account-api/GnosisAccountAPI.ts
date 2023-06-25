import {
  EntryPoint,
  EntryPoint__factory,
  // SimpleAccount as AAAccount,
  // SimpleAccount__factory as AAAccount__factory,
  // SimpleAccountFactory as AAAccountFactory,
  // SimpleAccountFactory__factory as AAAccountFactory__factory,
  UserOperationStruct,
} from "@account-abstraction/contracts";
import { arrayify, hexConcat, hexlify } from "@ethersproject/bytes";
import {
  AccountApiParamsType,
  EthersTransactionRequest,
  TransactionDetailsForUserOp,
} from "./types";
import { Wallet } from "@ethersproject/wallet";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import { resolveProperties } from "@ethersproject/properties";
import {
  calcPreVerificationGas,
  HttpRpcClient,
} from "@account-abstraction/sdk";
import {
  JsonRpcProvider,
  Provider,
  TransactionReceipt,
} from "@ethersproject/providers";
import AAPaymasterAPI from "./AAPaymasterAPI";
import { Contract } from "@ethersproject/contracts";
import {
  eip4337ManagerABI,
  erc20ABI,
  gSafeAccountFactoryABI,
} from "./contracts";
import { BaseAccountAPI } from "@account-abstraction/sdk/dist/src/BaseAccountAPI";
import { formatUnits } from "@ethersproject/units";

export enum Operation {
  Call,
  DelegateCall,
}

/**
 * An implementation of the BaseAccountAPI using the SimpleAccount contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
class GAccountAPI extends BaseAccountAPI {
  name: string;
  factoryAddress?: string;
  owner?: Wallet;
  ownerAddress?: string;
  index: number;
  bundler: HttpRpcClient;
  provider: Provider;
  providerUrl: string;
  paymasterAPI: AAPaymasterAPI;
  entryPointView1: EntryPoint;
  maxVerificationGasLimit: BigNumber = BigNumber.from(1000000);
  /**
   * our account contract.
   * should support the "execFromEntryPoint" and "nonce" methods
   */
  accountContract?: Contract;

  factory?: Contract;

  constructor(params: AccountApiParamsType<any>) {
    super(params);
    this.entryPointView1 = EntryPoint__factory.connect(
      params.entryPointAddress,
      params.provider
    ).connect(AddressZero);
    this.provider = params.provider;
    this.providerUrl = params.providerUrl;
    this.bundler = params.bundler;
    this.factoryAddress = params.accountFactory;
    this.paymasterAPI = new AAPaymasterAPI();
    this.owner = params.deserializeState?.privateKey
      ? new Wallet(params.deserializeState?.privateKey)
      : params.privateKey
      ? new Wallet(params.privateKey)
      : undefined;
    if (!this.owner) {
      this.ownerAddress = params.ownerAddress;
    }
    this.index = 0;
    this.overheads = {
      fixed: 21000,
      perUserOp: 18300,
      perUserOpWord: 4,
      zeroByte: 4,
      nonZeroByte: 16,
      bundleSize: 1,
      sigSize: 65,
    };
    this.name = "GAccountAPI";
  }
  async init() {
    if ((await this.provider.getCode(this.entryPointAddress)) === "0x") {
      throw new Error(`entryPoint not deployed at ${this.entryPointAddress}`);
    }
    await this.getAccountAddress();
    return this;
  }

  async _getAccountContract(): Promise<Contract> {
    if (this.accountContract == null) {
      this.accountContract = new Contract(
        await this.getAccountAddress(),
        eip4337ManagerABI,
        this.provider
      );
    }
    return this.accountContract;
  }

  /**
   * return userOpHash for signing.
   * This value matches entryPoint.getUserOpHash (calculated on-chain, to avoid a view call)
   * @param userOp userOperation, (signature field ignored)
   */
  async getUserOpHash(userOp: UserOperationStruct): Promise<string> {
    const op = await resolveProperties(userOp);
    return this.entryPointView1.callStatic
      .getUserOpHash({ ...op, signature: "0x" })
      .then((v) => {
        console.log("Userop hash by onchain...", v);
        return v;
      })
      .catch((e) => {
        console.error("onchain userophash failed", e);
        return "";
      });
  }

  /**
   * return the value to put into the "initCode" field, if the account is not yet deployed.
   * this value holds the "factory" address, followed by this account's information
   */
  async getAccountInitCode(): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== "") {
        this.factory = new Contract(
          this.factoryAddress,
          gSafeAccountFactoryABI,
          this.provider
        );
      } else {
        throw new Error("no factory to get initCode");
      }
    }
    let address: string;
    if (this.ownerAddress) {
      address = this.ownerAddress;
    } else if (this.owner) {
      address = await this.owner.getAddress();
    } else {
      throw new Error("Owner must be initialized");
    }
    return hexConcat([
      this.factory.address,
      this.factory.interface.encodeFunctionData("createAccount", [
        address,
        this.index,
      ]),
    ]);
  }

  async getNonce(): Promise<BigNumber> {
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0);
    }
    const accountContract = await this._getAccountContract();

    return await (accountContract as any).getNonce().then((v: any) => {
      // console.log("Nonce for account", v);
      return v;
    });
  }

  /**
   * return maximum gas used for verification.
   * NOTE: createUnsignedUserOp will add to this value the cost of creation, if the contract is not yet created.
   */
  async getVerificationGasLimit() {
    return 100000;
  }

  /**
   * should cover cost of putting calldata on-chain, and some overhead.
   * actual overhead depends on the expected bundle size
   */
  async getPreVerificationGasWithPaymaster(
    userOp: Partial<UserOperationStruct>,
    paymasterDataLength: number
  ): Promise<number> {
    const p = await resolveProperties(userOp);
    return calcPreVerificationGas(
      { ...p, paymasterAndData: hexlify(Buffer.alloc(paymasterDataLength, 1)) },
      this.overheads
    );
  }

  /**
   * encode a method call from entryPoint to our contract
   * @param target
   * @param value
   * @param data
   */
  async encodeExecute(
    target: string,
    value: BigNumberish,
    data: string
  ): Promise<string> {
    const accountContract = await this._getAccountContract();
    return accountContract.interface.encodeFunctionData("executeAndRevert", [
      target,
      value,
      data,
      Operation.Call,
    ]);
  }

  async signUserOpHash(userOpHash: string): Promise<string> {
    if (!this.owner) {
      throw new Error("Signer should initialized");
    }
    return await this.owner.signMessage(arrayify(userOpHash));
  }

  signMessage = async (context: any, request?: any): Promise<string> => {
    if (!this.owner) {
      throw new Error("Signer should initialized");
    }
    return this.owner.signMessage(request?.rawSigningData || "");
  };

  signUserOpWithContext = async (
    userOp: UserOperationStruct
  ): Promise<UserOperationStruct> => {
    return {
      ...userOp,
      signature: await this.signUserOpHash(await this.getUserOpHash(userOp)),
    };
  };

  async encodeUserOpCallDataAndGasLimit(
    detailsForUserOp: TransactionDetailsForUserOp
  ): Promise<{ callData: string; callGasLimit: BigNumber }> {
    function parseNumber(a: any): BigNumber | null {
      if (a == null || a === "") {
        return null;
      }
      return BigNumber.from(a.toString());
    }

    const value = parseNumber(detailsForUserOp.value) ?? BigNumber.from(0);
    const callData =
      detailsForUserOp.target !== "0x"
        ? await this.encodeExecute(
            detailsForUserOp.target,
            value,
            detailsForUserOp.data
          )
        : "0x";
    let callGasLimit =
      parseNumber(detailsForUserOp.gasLimit) ??
      (await this.provider
        .estimateGas({
          from: this.entryPointAddress,
          to: this.getAccountAddress(),
          data: callData,
        })
        .catch(() => {
          console.error("Call gas limit estimation failed");
          return BigNumber.from("50803");
        }));
    console.info("Gas feee", callGasLimit);
    const isDeployed = await this.isAccountDeployed();
    if (!isDeployed) {
      callGasLimit = callGasLimit.mul(5).mul(15);
      console.info("New gas fee", callGasLimit);
    }
    return {
      callData,
      callGasLimit: callGasLimit.add(BigNumber.from(this.overheads?.fixed)),
    };
  }

  /**
   * create a UserOperation, filling all details (except signature)
   * - if account is not yet created, add initCode to deploy it.
   * - if gas or nonce are missing, read them from the chain (note that we can't fill gaslimit before the account is created)
   * @param info
   */
  async createUnsignedUserOp(
    info: TransactionDetailsForUserOp
  ): Promise<UserOperationStruct> {
    // console.log("Create unsigned userop");
    const { callData, callGasLimit } =
      await this.encodeUserOpCallDataAndGasLimit(info);
    const initCode = await this.getInitCode();

    const initGas = await this.estimateCreationGas(initCode);
    const verificationGasLimit = BigNumber.from(
      info.verificationGasLimit || (await this.getVerificationGasLimit())
    ).add(initGas);
    console.warn("Verification gas limit", verificationGasLimit);
    let { maxFeePerGas, maxPriorityFeePerGas } = info;
    if (maxFeePerGas == null || maxPriorityFeePerGas == null) {
      const feeData = await GAccountAPI.getGasPrice(this.providerUrl);
      if (maxFeePerGas == null) {
        maxFeePerGas = feeData.maxFeePerGas ?? undefined;
      }
      if (maxPriorityFeePerGas == null) {
        maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? undefined;
      }

      console.warn("Fee data", feeData);
    }

    const partialUserOp: any = {
      sender: this.getAccountAddress(),
      nonce: info.nonce ?? this.getNonce(),
      initCode,
      callData,
      callGasLimit,
      verificationGasLimit: verificationGasLimit,
      maxFeePerGas,
      maxPriorityFeePerGas,
      paymasterAndData: "0x",
    };
    let preVerificationGas: number | undefined;
    if (this.paymasterAPI != null && this.paymasterAPI.paymasterUrl) {
      // fill (partial) preVerificationGas (all except the cost of the generated paymasterAndData)
      partialUserOp.signature = "0x";
      const pm_Response = await this.paymasterAPI.sponsorUserOperation(
        partialUserOp,
        this.entryPointAddress,
        {
          type: "sponsor",
          address: "0x",
        }
      );

      if (pm_Response) {
        preVerificationGas = pm_Response.preVerificationGas;
        partialUserOp.verificationGasLimit = BigNumber.from(
          pm_Response.verificationGasLimit
        );
        partialUserOp.callGasLimit = BigNumber.from(pm_Response.callGasLimit);

        partialUserOp.maxFeePerGas = BigNumber.from(pm_Response.maxFeePerGas);
        partialUserOp.maxPriorityFeePerGas = BigNumber.from(
          pm_Response.maxPriorityFeePerGas
        );
        partialUserOp.paymasterAndData = pm_Response.paymasterAndData;
      }
    } else {
      console.error("Paymaster not defined");
    }
    if (!preVerificationGas) {
      // console.log("For previrification Gas", partialUserOp);

      preVerificationGas = await this.getPreVerificationGas(partialUserOp);
      preVerificationGas += 1000;
    }

    console.warn(
      "Max prefund1",
      BigNumber.from(preVerificationGas)
        .add(BigNumber.from(partialUserOp.verificationGasLimit).mul(3))
        .add(partialUserOp.callGasLimit)
        .mul(partialUserOp.maxFeePerGas)
    );
    return {
      ...partialUserOp,
      preVerificationGas: preVerificationGas,
      signature: "",
    };
  }

  reCreateSignedUserOp = async (userOp: UserOperationStruct) => {
    let partialUserOp = userOp;
    partialUserOp.signature = "0x";
    if (this.paymasterAPI != null && this.paymasterAPI.paymasterUrl) {
      // fill (partial) preVerificationGas (all except the cost of the generated paymasterAndData)

      const pm_Response = await this.paymasterAPI.sponsorUserOperation(
        partialUserOp,
        this.entryPointAddress,
        {
          type: "sponsor",
          address: "0x",
        }
      );

      if (pm_Response) {
        partialUserOp.preVerificationGas = pm_Response.preVerificationGas;
        partialUserOp.verificationGasLimit = BigNumber.from(
          pm_Response.verificationGasLimit
        );
        partialUserOp.callGasLimit = BigNumber.from(pm_Response.callGasLimit);

        partialUserOp.maxFeePerGas = BigNumber.from(pm_Response.maxFeePerGas);
        partialUserOp.maxPriorityFeePerGas = BigNumber.from(
          pm_Response.maxPriorityFeePerGas
        );
        partialUserOp.paymasterAndData = pm_Response.paymasterAndData;
      }
    } else {
      console.error("Paymaster not defined");
    }
    return {
      ...partialUserOp,
      signature: await this.signUserOpHash(
        await this.getUserOpHash(partialUserOp)
      ),
    };
  };

  createUnsignedUserOpForTransaction = async (
    transaction: EthersTransactionRequest
  ): Promise<UserOperationStruct> => {
    console.log("Transaction Request......................", transaction);
    this.paymasterAPI.setPaymaster(transaction.paymasterUrl);
    const userOp = await this.createUnsignedUserOp({
      target: transaction.to,
      data: transaction.data ? hexConcat([transaction.data]) : "0x",
      value: transaction.value,
      gasLimit: transaction.gasLimit,
      maxFeePerGas: transaction.maxFeePerGas,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
    });
    userOp.sender = await userOp.sender;
    userOp.nonce = await userOp.nonce;
    userOp.initCode = await userOp.initCode;
    userOp.callData = await userOp.callData;
    userOp.callGasLimit = await userOp.callGasLimit;
    userOp.verificationGasLimit = await userOp.verificationGasLimit; // BigNumber.from("1500000");
    userOp.preVerificationGas = await userOp.preVerificationGas;
    userOp.maxFeePerGas = await userOp.maxFeePerGas;
    userOp.maxPriorityFeePerGas = await userOp.maxPriorityFeePerGas;
    userOp.paymasterAndData = await userOp.paymasterAndData;
    userOp.signature = await userOp.signature;

    return userOp;
  };

  sendUserOp = async (
    userOp: UserOperationStruct
  ): Promise<TransactionReceipt | null | undefined> => {
    if (this.bundler) {
      let lastUserOp = userOp;
      const estimation:
        | {
            callGasLimit: number;
            preVerificationGas: number;
            verificationGas: number;
          }
        | undefined = await this.bundler
        .estimateUserOpGas(userOp)
        .then((v) => v as any)
        .catch((e) => {
          console.warn(
            "Estimation for Recreation Failed! UserOp won't recreate if It exceed the Gas Limit"
          );
        });

      if (estimation) {
        if (
          BigNumber.from(estimation.verificationGas)
            .sub(await userOp.verificationGasLimit)
            .abs()
            .gt(20000)
        ) {
          console.log("Re Creating User Op...", estimation.verificationGas);
          lastUserOp = await this.reCreateSignedUserOp({
            ...userOp,
            verificationGasLimit: BigNumber.from(estimation.verificationGas),
          });
        }
      }
      try {
        const userOpHash = await this.bundler.sendUserOpToBundler(lastUserOp);
        console.log("Userop Hash=============================", userOpHash);
        const hash = await this.getUserOpEventRPC(
          await lastUserOp.sender,
          userOpHash
        ).then((res) => {
          console.log("Userop Event", res);
          if (res) {
            return this.getTxn(res.transactionHash);
          }
        });
        return hash;
      } catch (e) {
        console.log(e);
        if (!e.body) {
          return;
        }

        const errBody = JSON.parse(e.body);
        if (errBody.error) {
          if (errBody.code === -32602) {
            if (
              (errBody.data as string).includes("replacement op must increase")
            ) {
              console.log("Replacing");
              lastUserOp = await this.reCreateSignedUserOp({
                ...userOp,
                maxFeePerGas: BigNumber.from(await lastUserOp.maxFeePerGas)
                  .div(100)
                  .mul(110),
                maxPriorityFeePerGas: BigNumber.from(
                  await lastUserOp.maxPriorityFeePerGas
                )
                  .div(100)
                  .mul(110),
              });
              const userOpHash = await this.bundler.sendUserOpToBundler(
                lastUserOp
              );
              console.log(
                "Userop Hash=============================",
                userOpHash
              );
              const hash = await this.getUserOpEventRPC(
                await lastUserOp.sender,
                userOpHash
              ).then((res) => {
                console.log("Userop Event", res);
                if (res) {
                  return this.getTxn(res.transactionHash);
                }
              });
              return hash;
            }
          }
        }
      }
    }
    return null;
  };
  async getUserOpEventRPC(
    address: string,
    userOpHash: string,
    timeout = 60000,
    interval = 5000
  ) {
    const endtime = Date.now() + timeout;
    const block = await this.provider.getBlock("latest");
    while (Date.now() < endtime) {
      const events = await this.entryPointView1.queryFilter(
        this.entryPointView1.filters.UserOperationEvent(userOpHash, address),
        Math.max(0, block.number - 1000)
      );
      console.log("Finding transaction", userOpHash, address);
      console.log("Block number", block.number - 1000);
      if (events.length > 0) {
        // console.log(events[0]);
        return events[0];
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  }
  async getUserOpRevertEventRPC(
    address: string,
    userOpHash: string,
    timeout = 30000,
    interval = 5000
  ) {
    const endtime = Date.now() + timeout;
    while (Date.now() < endtime) {
      const events = await this.entryPointView1.queryFilter(
        this.entryPointView1.filters.UserOperationRevertReason(userOpHash)
      );

      if (events.length > 0) {
        // console.log(events[0].args.revertReason);
        return events[0].transactionHash;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  }
  public static async getGasPrice(providerUrl?: string) {
    try {
      const rpcProvider = new JsonRpcProvider(providerUrl);
      const [fee, block] = await Promise.all([
        rpcProvider.send("eth_maxPriorityFeePerGas", []),
        rpcProvider.getBlock("latest"),
      ]);
      const tip = BigNumber.from(fee);
      const buffer = tip.div(100).mul(50);
      const maxPriorityFeePerGas = tip.add(buffer);
      const maxFeePerGas = block.baseFeePerGas
        ? block.baseFeePerGas.mul(2).add(maxPriorityFeePerGas)
        : maxPriorityFeePerGas;
      console.log(
        "estimated fees",
        formatUnits(maxFeePerGas, "gwei"),
        formatUnits(maxPriorityFeePerGas, "gwei")
      );
      // fetch("https://gasstation.polygon.technology/v2")
      //   .then((v) => v.json())
      //   .then((v) => {
      //     console.error("gas station estimations", v);
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
      return {
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
      };
    } catch (e) {
      console.error("Failed to estimate ");
      return {
        maxPriorityFeePerGas: BigNumber.from("10000000"),
        maxFeePerGas: BigNumber.from("10000000"),
      };
    }
  }

  async getTxn(txnHash: string) {
    return this.provider.getTransactionReceipt(txnHash);
  }
  static getNativeBalance = async (address: string, rpcUrl: string) => {
    const provider = new JsonRpcProvider(rpcUrl);
    await provider.ready;
    const bal = await provider.getBalance(address);
    return BigNumber.from(bal);
  };
  static getERC20TokenBalance = async (
    address: string,
    rpcUrl: string,
    contractAddress: string
  ) => {
    const provider = new JsonRpcProvider(rpcUrl);
    const contract = new Contract(contractAddress, erc20ABI, provider);
    const bal = await contract.balanceOf(address);
    return BigNumber.from(bal);
  };

  async isAccountDeployed() {
    const senderAddressCode = await this.provider.getCode(
      this.getAccountAddress()
    );
    if (senderAddressCode.length > 2) {
      return true;
    }
    return false;
  }
}

export default GAccountAPI;
