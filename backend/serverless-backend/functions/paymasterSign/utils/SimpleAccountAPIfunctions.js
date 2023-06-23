const { JsonRpcProvider } = require("@ethersproject/providers")
const Config = require("../exconfig.json")
const { BigNumber } = require("ethers")
const { calcPreVerificationGas } = require("@account-abstraction/sdk")
const { resolveProperties } =  require('ethers/lib/utils')

const provider = new JsonRpcProvider(Config.network.provider);

module.exports.getVerificationGasLimit = async (initCode)=>{
    if(initCode == null || initCode === "0x"){initGas = 0}
    else{
        const deployerAddress = initCode.substring(0,42)
        const deployerCallData = initCode.substring(42)
        initGas =  provider.estimateGas({to: deployerAddress, data:deployerCallData})
    }

    return BigNumber.from(100000).add(initGas)
}

module.exports.getPreVerificationGas = async (userOp) => {
    return await calcPreVerificationGas(userOp)
}