const config = {
  enablePasswordEncryption: false,
  showTransactionConfirmationScreen: true,
  factory_address: process.env.NEXT_PUBLIC_KAIJU_ACC_FACTORY,
  nft_paymaster: process.env.NEXT_PUBLIC_KAIJU_NFT_PAYM,
  entryPointAddress: process.env.NEXT_PUBLIC_ENTRYPOINT,
  game_factory_address: process.env.NEXT_PUBLIC_GAME_FACTORY,
  networks: {
    "0": {
      chainID: parseInt(process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID, 16),
      family: "EVM",
      name: "Mumbai Testnet",
      provider: process.env.NEXT_PUBLIC_RPC,
      bundler: process.env.NEXT_PUBLIC_BUNDLER,
      image: "https://polygonscan.com/images/svg/brands/polygon.svg",
      assets: [
        {
          id: "80001_1",
          coinGeckoId: "tether",
          networkId: "0",
          name: "Tether",
          image: "/assets/icons/usdt.png",
          symbol: "USDT",
          contractAddress: process.env.NEXT_PUBLIC_USDT_POLYGON_CONTRACT,
          decimals: 6,
          isDisabled: false,
        },
        {
          id: "80001_3",
          name: "Kaiju Arcade",
          networkId: "0",
          image: "/assets/icons/karc.png",
          symbol: "KARC",
          contractAddress: process.env.NEXT_PUBLIC_KARD_POLYGON_CONTRACT,
          decimals: 0,
          isDisabled: false,
          gameId: "game_0",
        },
        {
          //baseAsset
          id: "80001_0",
          coinGeckoId: "matic-network",
          networkId: "0",
          symbol: "MATIC",
          name: "MATIC",
          decimals: 18,
          image: "https://polygonscan.com/images/svg/brands/polygon.svg",
          isBaseAsset: true,
        },
      ],
      primaryAssetIndex: 0,
      baseAssetIndex: 2,
    },
  },
  games: [
    {
      id: "game_0",
      title: "Kaiju Arcade",
    },
  ],
};

export type NetworkIdEnum = keyof typeof config.networks;
export default config;
