const {JsonRpcProvider} = require("@ethersproject/providers")
const {Wallet} = require("@ethersproject/wallet")
const {Contract} = require("@ethersproject/contracts")
const {parseUnits} = require("@ethersproject/units")
const KGFABI = require("./ContractABIs/kgfabi.json");
const KARDABI = require("./ContractABIs/kardabi.json");
const USDTABI = require("./ContractABIs/usdtabi.json");

module.exports.gameRewards = async (event) => {
    try {
        const provider = new JsonRpcProvider(process.env.RPC_URL);
    
        const privateKey =  process.env.PRIVATE_KEY;
        const wallet = new Wallet(privateKey, provider);

        const contractAddress = process.env.GAME_FACTORY_CONTRACT;
        const KARDAddress = process.env.KAIJU_TOKEN_CONTRACT;
        const USDTAddress = process.env.USDT_CONTRACT;
        const KARDContract = new Contract(KARDAddress, KARDABI, wallet);
        const USDTContract = new Contract(USDTAddress, USDTABI, wallet);

        USDTprice = {
            1:'40',
            2:'15',
            3:'10',
            4:'5',
            5:'5',
            6:'5',
            7:'5',
        }

        KARDprice = {
            1:'4000',
            2:'1500',
            3:'1000',
            4:'500',
            5:'500',
            6:'500',
            7:'500',
        }

        let [year_, month_, date_] = await getLastDate();

        let leaderBoard = await getLB(year_, month_, date_, KGFcontract);
        console.log(leaderBoard);

        // let lb = [{'player':'0x151653dE68F8fAd3968B2c4123BC2c386B265ed0'},{'player':'0x151653dE68F8fAd3968B2c4123BC2c386B265ed0'}];

        let lengthLB = leaderBoard.length;

        let priceWinners = 7;

        if (lengthLB < 7){priceWinners = lengthLB;}

        for (let i = 0; i < priceWinners; i++) {
            let player = lb[lengthLB-i-1]['player'];
            await transferKARD(player, KARDprice[i+1], KARDContract);
            await transferUSDT(player, USDTprice[i+1], USDTContract);
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(
            {
                message: 'success',
                input: event,
            },
            null,
            2
            ),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(
            {
                message: 'ERROR..',
                error: err,
            },
            null,
            2
            ),
        };
    }
    
};

async function getLB(_year, _month, _date, contract) {
    const result = await contract.getLeaderBoardByDate(_year, _month, _date);
    console.log('Result:', result);
    return result;
}

async function transferKARD(receiver, amount, contract) {

    const recipientAddress = receiver;
    const decimalKARD = '0';
    const amount_ = parseUnits(amount, decimalKARD);
    const result = await contract.transfer(recipientAddress, amount_);
    console.log(result);
    console.log('Transfer completed.');
}

async function transferUSDT(receiver, amount, contract) {
    const recipientAddress = receiver;
    const decimalUSDT = '18';
    const amount_ = parseUnits(amount, decimalUSDT);
    const result = await contract.transfer(recipientAddress, amount_);
    console.log(result);
    console.log('Transfer completed.');
}

async function getLastDate(){
    let timeNow = new Date();
    let hourNow = timeNow.getUTCHours();
    let timeNowSING = new Date(timeNow.setUTCHours(hourNow + 8));
    timeYestSING = new Date(timeNowSING.setUTCHours(-2));
    year = timeYestSING.getUTCFullYear();
    month = timeYestSING.getUTCMonth() + 1;
    date = timeYestSING.getUTCDate();
    return [year, month, date];
}
