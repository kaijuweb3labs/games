const Config = require("./exconfig.json")
const { JsonRpcProvider } = require("@ethersproject/providers")
const {Wallet} = require("@ethersproject/wallet")
const {Contract} = require("@ethersproject/contracts")
const verifyingNFTPaymasterABI = require("./contractABIs/verifyingNFTPaymaster.json")
const { arrayify, hexConcat, hexZeroPad, hexlify } = require("@ethersproject/bytes")
const { BigNumber } = require("ethers")
const {getVerificationGasLimit, getPreVerificationGas} = require("./utils/SimpleAccountAPIfunctions.js")

module.exports.handler = async (event) => {

  const eventBody =  JSON.parse(event.body)
  const metaDataURL = "ipfs://YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"

  if (eventBody.sender.length < 2 || eventBody.sender.length > 42) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          userOp: "Invalied Sender Address",
          input: event.body,
        },
        null,
        2
      ),
    };
  }

  try{
    const NewUserOp = {
      sender: eventBody.sender,
      nonce: eventBody.nonce,
      initCode: eventBody.initCode,
      callData: "0x",
      callGasLimit: "",
      verificationGasLimit: "",
      maxFeePerGas: "",
      maxPriorityFeePerGas: "",
      paymasterAndData: "0x",
      preVerificationGas: 0,
      signature: "0x"
    }

    const provider = new JsonRpcProvider(Config.network.provider);
    console.log("User Op Init : ", NewUserOp)
    
    NewUserOp.callGasLimit = await provider.estimateGas ({
      from: Config.network.entryPointAddress,
      to: NewUserOp.sender,
      data: NewUserOp.callData
    })
    
    NewUserOp.verificationGasLimit = BigNumber.from(await getVerificationGasLimit(NewUserOp.initCode));

    const feeData = await provider.getFeeData();
    NewUserOp.maxFeePerGas = feeData.maxFeePerGas;
    NewUserOp.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;

    console.log("New User Op : ", NewUserOp)

    const preUserOp = JSON.parse(JSON.stringify(NewUserOp))

    NewUserOp.preVerificationGas = await getPreVerificationGas(preUserOp);

    const userOp = JSON.parse(JSON.stringify(NewUserOp))

    console.log(userOp.preVerificationGas)
    const paymasterAddress = Config.nft_paymaster;
    const signer = new Wallet(
      "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      provider
    );

    const contract = new Contract(
      paymasterAddress,
      verifyingNFTPaymasterABI,
      provider
    );

    const validAfterObj = new Date();
    const validUntilObj = new Date();
    validAfterObj.setDate(validAfterObj.getDate() - 5);
    validUntilObj.setDate(validUntilObj.getDate() + 5);
    const validUntil = Math.floor(validUntilObj.getTime() / 1000);
    const validAfter = Math.floor(validAfterObj.getTime() / 1000);

    const hash = await contract.getHash(
      userOp,
      metaDataURL,
      validUntil,
      validAfter
    );

    console.log("Hash from contract", hash);
    const signedHash = await signer.signMessage(arrayify(hash));
    console.log("Signed Paymaster hash", signedHash);
    const encodedUri = contract.interface._abiCoder.encode(
      ["string"],
      [metaDataURL]
    );
    
    userOp.paymasterAndData = hexConcat([
      paymasterAddress,
      encodedUri,
      hexZeroPad(hexlify(validUntil), 32),
      hexZeroPad(hexlify(validAfter), 32),
      signedHash,
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          userOp: JSON.stringify(userOp),
          input: event.body,
        },
        null,
        2
      ),
    };
  } catch (err) {
    console.log(err)
    return {
      statusCode: 404,
      body: JSON.stringify(
        {
          error: err,
          input: event.body,
        },
        null,
        2
      ),
    };
  } 
};

