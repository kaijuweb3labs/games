import { Token } from "./blockchain";

export interface TokenBalance {
  usdRate?: number;
  balanceUsd?: number;
  balanceNative?: number;
}

export interface TokenData extends Token {
  networkIcon?: string;
  isCustomToken?: boolean;
  networkId: string;
  contractAddress?: string;
}

type BlockchainWalletAddress = string;
type AccountContractAddress = string;
type BlockchainPublicKey = string;
type BlockchainPrivateKey = string;
type MnemonicSeed = string;


export type EOAAccountAddress = string;
export type AAAccountAddress = string;
export type AccountAddress = {
  eoaAccountAddress?: EOAAccountAddress;
  aaAccountAddress?: AAAccountAddress;
};
export interface KaijuAccount {
  address?: AccountAddress;
  balances?: AssetsBalances;
  totalBalance: { currency: string; value: number };
  allNetworks?: boolean;
}

export interface KaijuWallet {
  accounts: KaijuAccount[];
  id?: string;
  name?: string;
  backedUpManually?: boolean;
  backedUp?: boolean;
  backupFile?: string | null;
  backupDate?: string;
  backupType?: string;
  deviceId?: string;
}


/*
 * The primary type representing amounts in fungible asset transactions.
 */
export type AnyAssetAmount<T extends AnyAsset = AnyAsset> = {
  asset: T;
  amount: string;
};

export type AccountBalance = {
  /**
   * The address whose balance was measured.
   */
  address: HexString;
  /**
   * The measured balance and the asset in which it's denominated.
   */
  assetAmount: {
    coin: BigNumberish;
    rate: number;
    value: number;
    currency: string;
    isMarket?: boolean;
  };
  /**
   * The block height at while the balance measurement is valid.
   */
  blockHeight?: string;
  /**
   * When the account balance was measured, using Unix epoch timestamps.
   */
  retrievedAt: number;
  /**
   * A loose attempt at tracking balance data provenance, in case providers
   * disagree and need to be disambiguated.
   */
  dataSource: 'alchemy' | 'local' | 'infura' | 'custom';
};

export type EVMNetwork = Network & {
  chainID: string;
  family: "EVM";
};
export type Network = {
  // two Networks must never share a name.
  name: string;
  family: NetworkFamily;
  chainID: number;
  provider: string;
  bundler: string;
  image: string;
  primaryAssetIndex:number;
  baseAssetIndex:number;
  assets: NetworkBaseAsset[];
};
