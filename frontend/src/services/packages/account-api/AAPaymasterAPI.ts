import { UserOperationStruct } from "@account-abstraction/contracts";
import { PaymasterAPI } from "@account-abstraction/sdk";
import { hexlify } from "@ethersproject/bytes";
import { resolveProperties } from "@ethersproject/properties";
export default class AAPaymasterAPI {
  public paymasterUrl?: string;
  private headerCreator?: () => Promise<Headers>;
  private forceDisable = false;
  async getPaymasterAndData(
    userOp: Partial<UserOperationStruct>
  ): Promise<string | undefined> {
    return userOp.paymasterAndData?.toString();
  }
  async sponsorUserOperation(
    userOp: Partial<UserOperationStruct>,
    _entryPoint: string,
    _pmSpecificData: { type: string; address: string }
  ): Promise<{
    paymasterAndData: string;
    preVerificationGas: number;
    verificationGasLimit: string;
    callGasLimit: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
  } | null> {
    const newUserOp = await resolveProperties({
      ...userOp,
      signature: "0x",
      paymasterAndData: "0x",
    });
    if (this.paymasterUrl) {
      return fetch(this.paymasterUrl, {
        method: "POST",
        body: JSON.stringify({ params: [newUserOp] }),
        headers: this.headerCreator
          ? await this.headerCreator()
          : {
              "Content-Type": "application/json",
            },
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log("Recieved userop::", res.result);
          return {
            paymasterAndData: res.result.paymasterAndData,
            preVerificationGas: res.result.preVerificationGas,
            verificationGasLimit: res.result.verificationGasLimit,
            callGasLimit: res.result.callGasLimit,
            maxFeePerGas: res.result.maxFeePerGas,
            maxPriorityFeePerGas: res.result.maxPriorityFeePerGas,
          };
        });
    }
    return null;
  }
  public setPaymaster(url?: string, headerCreator?: () => Promise<Headers>) {
    this.paymasterUrl = url;
    this.headerCreator = headerCreator;
  }
  async getDummyPaymasterData() {
    return this.forceDisable ? "0x" : hexlify(Buffer.alloc(149, 1));
  }
}
