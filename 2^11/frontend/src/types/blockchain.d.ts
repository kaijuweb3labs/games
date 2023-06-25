import { NetworkTypeEnum, TokenTypeEnum } from "@utils/enums/blockchain";
import { BlockchainEnum } from "../enums/enums";

export interface BlockchainNetwork {
  id: string;
  name: BlockchainEnum;
  icon: string;
  rpcUrl?: RpcUrl;
  nativeToken: NativeToken;
  defaultERC20Tokens?: ERC20Token[];
  disable?: boolean;
  erc20CustomTokenIdPrefix: string;
}

export interface Token {
  tokenId: string;
  coinGeckoId?: string;
  name: string;
  symbol: string;
  type: TokenTypeEnum;
  icon?: string;
}
export interface NativeToken extends Token {}

export type ContractAddress = string;

export interface ERC20Token extends Token {
  name: string;
  symbol: string;
  contractAddress: ContractAddress;
  decimals: number;
}

export interface Connection {
  name: string;
  domain: string;
  network: Blockchain;
  image: any;
}

export interface RpcUrl {
  url: string;
  networkType: NetworkTypeEnum;
}
