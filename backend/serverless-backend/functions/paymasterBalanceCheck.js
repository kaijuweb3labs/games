const aws = require('aws-sdk');
const {JsonRpcProvider} = require("@ethersproject/providers")
const {Contract} = require("@ethersproject/contracts")
const PaymasterABI = require("./ContractABIs/PaymasterABI.json");
const ses = new aws.SES({region: process.env.REGION});

module.exports.paymasterBalanceCheck = async (event) => {
  try {
    let balance_ = await getPaymasterBalance();

    balance_ /= 10**18;

    console.log("matic : ", balance_);

    const emailData = `
      Dear Admin,

      The Paymaster (${process.env.PAYMASTER_CONTRACT}) balance in ${process.env.STAGE} environment is LESS than ${process.env.PAYMASTER_THRESHOLD_VALUE} MATIC. It is ${balance_}.
      
      Thanks,
      Team DevOps
    `;

    if (balance_ < parseInt(process.env.PAYMASTER_THRESHOLD_VALUE)){
      await sendMail(`Kaiju ${process.env.STAGE} Paymaster (${process.env.PAYMASTER_CONTRACT}) Balance Low`, emailData);
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
          balance: balance_,
        },
        null,
        2
      ),
    };
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify(
        {
          error: err,
        },
        null,
        2
      ),
    };
  }
};

async function sendMail(subject, data) {
  const emailParams = {
        Destination: {
          ToAddresses: [process.env.TO_ADDRESS],
        },
        Message: {
          Body: {
            Text: { Data: data },
          },
          Subject: { Data: subject },
        },
        Source: process.env.FROM_ADDRESS,
  };
      
  try {
    let key = await ses.sendEmail(emailParams).promise();
    console.log(key);
    console.log("MAIL SENT SUCCESSFULLY!");      
  }
  catch (e) {
    console.log("FAILURE IN SENDING MAIL!", e);
  }  
  return;
}

async function getPaymasterBalance(){
  const provider = new JsonRpcProvider(process.env.RPC_URL);
  const contractAddress = process.env.PAYMASTER_CONTRACT;
  const contract = new Contract(contractAddress, PaymasterABI, provider);
  try {
    const balance = await contract.getDeposit();
    console.log('Contract Balance:', balance.toString());
    return balance;
  } catch (error) {
    console.error('Error:', error);
    return;
  }
}
