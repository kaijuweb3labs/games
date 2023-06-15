export type NetworkFamily = string;
/**
 * Base asset of the network
 * Should be structurally compatible with FungibleAsset
 */
export type NetworkBaseAsset = {
  id: string;
  coinGeckoId?: string;
  networkId: string;
  symbol: string;
  name: string;
  decimals: number;
  contractAddress?: string;
  image: string | IconEnum;
  isBaseAsset?: boolean;
  isCustom?: boolean;
  isDisabled?: boolean;
  gameId?: string;
};

