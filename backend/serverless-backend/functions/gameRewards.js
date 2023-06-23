const {JsonRpcProvider} = require("@ethersproject/providers");
const {Wallet} = require("@ethersproject/wallet");
const {Contract} = require("@ethersproject/contracts");
const {parseUnits} = require("@ethersproject/units");
const {MongoClient} = require("mongodb");
const KGFABI = require("./ContractABIs/kgfabi.json");
const KARCABI = require("./ContractABIs/karcabi.json");
const USDTABI = require("./ContractABIs/usdtabi.json");

const client = new MongoClient(process.env.MONGODB_URL);
const database = client.db(process.env.DB_NAME);
const gameWinner = database.collection('gameWinner');

module.exports.gameRewards = async (event) => {
    try {
        const provider = new JsonRpcProvider(process.env.RPC_URL);
    
        const privateKey =  process.env.PRIVATE_KEY;
        const wallet = new Wallet(privateKey, provider);

        const contractAddress = process.env.GAME_FACTORY_CONTRACT;
        const KARCAddress = process.env.KAIJU_TOKEN_CONTRACT;
        const USDTAddress = process.env.USDT_CONTRACT;
        const KGFcontract = new Contract(contractAddress, KGFABI, wallet);
        const KARCContract = new Contract(KARCAddress, KARCABI, wallet);
        const USDTContract = new Contract(USDTAddress, USDTABI, wallet);

        USDTprice = {
            1:process.env.USDT_REWARD_1,
            2:process.env.USDT_REWARD_2,
            3:process.env.USDT_REWARD_3,
            4:process.env.USDT_REWARD_4,
            5:process.env.USDT_REWARD_4,
            6:process.env.USDT_REWARD_4,
            7:process.env.USDT_REWARD_4,
            8:process.env.USDT_REWARD_4,
            9:process.env.USDT_REWARD_4,
            10:process.env.USDT_REWARD_4
        }

        KARCprice = {
            1:process.env.KARC_REWARD_1,
            2:process.env.KARC_REWARD_2,
            3:process.env.KARC_REWARD_3,
            4:process.env.KARC_REWARD_4,
            5:process.env.KARC_REWARD_4,
            6:process.env.KARC_REWARD_4,
            7:process.env.KARC_REWARD_4,
            8:process.env.KARC_REWARD_4,
            9:process.env.KARC_REWARD_4,
            10:process.env.KARC_REWARD_4
        }

        let [year_, month_, date_] = await getLastDate();

        let leaderBoard = await getLB(year_, month_, date_, KGFcontract);
        console.log(leaderBoard);

        let lengthLB = leaderBoard.length;

        let priceWinners = 10;

        if (lengthLB < 10){priceWinners = lengthLB;}

        for (let i = 0; i < priceWinners; i++) {
            let player = leaderBoard[lengthLB-i-1]['player'];
            await transferKARC(player, KARCprice[i+1], KARCContract);
            await transferUSDT(player, USDTprice[i+1], USDTContract);

            let date__ = await formatDate(year_, month_, date_);
            doc = {
                date : date__,
                pubKey : player,
                USDT : parseInt(USDTprice[i+1]),
                KARC : parseInt(KARCprice[i+1]),
                userInformed : false
            }
            await gameWinner.insertOne(doc);
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

async function transferKARC(receiver, amount, contract) {
    const recipientAddress = receiver;
    const decimalKARC = process.env.KARC_DECIMAL;
    const amount_ = parseUnits(amount, decimalKARC);
    const result = await contract.transfer(recipientAddress, amount_);
    console.log(result);
    console.log('Transfer completed.');
}

async function transferUSDT(receiver, amount, contract) {
    const recipientAddress = receiver;
    const decimalUSDT = process.env.USDT_DECIMAL;
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

async function formatDate(year, month, date) {
    const formattedYear = year.toString().padStart(4, '0');
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDate = date.toString().padStart(2, '0');
  
    return `${formattedYear}-${formattedMonth}-${formattedDate}`;
}
