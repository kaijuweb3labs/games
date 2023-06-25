import { BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";
import { AccessListish } from "@ethersproject/transactions";

export type EthersTransactionRequest = {
  to: string;
  from?: string;
  nonce?: BigNumberish;

  gasLimit?: BigNumberish;
  gasPrice?: BigNumberish;

  data?: BytesLike;
  value?: BigNumberish;
  chainId?: number;

  type?: number;
  accessList?: AccessListish;

  maxPriorityFeePerGas?: BigNumberish;
  maxFeePerGas?: BigNumberish;

  customData?: Record<string, any>;
  origin?: string;
  paymasterUrl?: string;
};

interface GasEstimate {
  preVerificationGas: BigNumberish;
  verificationGas: BigNumberish;
  callGasLimit: BigNumberish;
}

// export type TransactionReceipt = {
//   to: string;
//   from: string;
//   contractAddress: null;
//   transactionIndex: number;
//   gasUsed: {
//     type: string;
//     hex: string;
//   };
//   logsBloom: string;
//   blockHash: string;
//   transactionHash: string;
//   logs: [
//     {
//       transactionIndex: number;
//       blockNumber: number;
//       transactionHash: string;
//       address: string;
//       topics: string[];
//       data: string;
//       logIndex: number;
//       blockHash: string;
//     }
//   ];
//   blockNumber: number;
//   confirmations: number;
//   cumulativeGasUsed: {
//     type: string;
//     hex: string;
//   };
//   effectiveGasPrice: {
//     type: string;
//     hex: string;
//   };
//   status: number;
//   type: number;
//   byzantium: true;
// };
