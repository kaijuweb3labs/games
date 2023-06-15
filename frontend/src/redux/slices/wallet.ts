import { NetworkBaseAsset } from "@/types/network";
import {
  AAAccountAddress,
  AccountBalance,
  EOAAccountAddress,
  KaijuAccount,
  KaijuWallet,
  Network,
} from "@/types/wallet";
import { Wallet } from "@ethersproject/wallet";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Web3Auth from "@web3auth/single-factor-auth";
import { Auth } from "aws-amplify";
import { changeWalletInitlized, setIsUserLoading } from "./user";
import web3AuthConfig from "../../config/web3authconfig";
import exconfig, { NetworkIdEnum } from "@/config/exconfig";
import GAccountAPI from "@/services/packages/account-api";
import { JsonRpcBatchProvider } from "@ethersproject/providers";
import { HttpRpcClient } from "@account-abstraction/sdk";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
export enum WalletLoadingStates {
  PENDING,
  INITIALIZING,
  COMPLETED,
}
export type AssetsBalances = {
  [assetId: string]: AccountBalance;
};
export interface WalletState {
  isWalletLoading: WalletLoadingStates;
  account: KaijuAccount;
  activeNetworkId: NetworkIdEnum;
  supportedNetworks: { [id: string]: Network };
  entryPointAddress: string;
  accountFactoryAddress: string;
  games: { title: string; logo?: string; id: string }[];
}

const INITIAL_STATE: WalletState = {
  isWalletLoading: null,
  account: {
    balances: {},
    totalBalance: { currency: "$", value: 0 },
  },
  activeNetworkId: "0",
  supportedNetworks: exconfig.networks,
  entryPointAddress: exconfig.entryPointAddress,
  accountFactoryAddress: exconfig.factory_address,
  games: exconfig.games,
};
export const walletSlice = createSlice({
  name: "wallet",
  initialState: INITIAL_STATE,
  reducers: {
    setWallet: (state, action: PayloadAction<WalletState>) => {
      return { ...state, ...action.payload };
    },
    removeWallet: (_, __) => {
      return { ...INITIAL_STATE };
    },
    updateBalances: (
      state,
      action: PayloadAction<{ balances: AssetsBalances }>
    ) => {
      state.account.balances = {
        ...state.account.balances,
        ...action.payload.balances,
      };
    },
    updateTotalBalance: (state, action: PayloadAction<{ total: number }>) => {
      state.account.totalBalance = {
        currency: "$",
        value: action.payload.total,
      };
    },
    updateDisableAsset: (
      state,
      action: PayloadAction<{ value: boolean; assetId: string }>
    ) => {
      const assets = state.supportedNetworks[state.activeNetworkId].assets;
      const newAssets = assets.map((ass) => {
        if (ass.id === action.payload.assetId) {
          return { ...ass, isDisabled: action.payload.value };
        }
        return ass;
      });
      state.supportedNetworks[state.activeNetworkId].assets = newAssets;
    },
    addNetworkAsset: (
      state,
      action: PayloadAction<{
        asset: NetworkBaseAsset;
        networkId: NetworkIdEnum;
      }>
    ) => {
      const chainId = state.supportedNetworks[action.payload.networkId].chainID;
      const length =
        state.supportedNetworks[action.payload.networkId].assets.length;
      state.supportedNetworks[action.payload.networkId].assets = [
        ...state.supportedNetworks[action.payload.networkId].assets,
        { ...action.payload.asset, id: `${chainId}_${length}` },
      ];
    },
    setAccountAddress: (
      state,
      action: PayloadAction<{
        eoaAddress: EOAAccountAddress;
        aaAddress: AAAccountAddress;
      }>
    ) => {
      console.log("Set account called..............");
      state.account.address = {
        eoaAccountAddress: action.payload.eoaAddress,
        aaAccountAddress: action.payload.aaAddress,
      };
    },
  },
});

export const initializeWallet = createAsyncThunk(
  "wallet/initializeWallet",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setIsUserLoading(true));
    console.log("Initializing wallet");
    const { web3auth }: { web3auth: Web3Auth } = thunkAPI.extra as any;
    const curSession = await Auth.currentSession();

    if (!curSession) {
      thunkAPI.dispatch(setIsUserLoading(false));
      return;
    }
    console.log(
      "Tokens.....................",
      curSession.getIdToken().payload.sub,
      curSession.getIdToken().getJwtToken()
    );
    const provider = await web3auth
      .connect({
        verifier: web3AuthConfig.verifier, // e.g. `web3auth-sfa-verifier` replace with your verifier name, and it has to be on the same network passed in init().
        verifierId: curSession.getIdToken().payload.email,
        idToken: curSession.getIdToken().getJwtToken(), // e.g. `Yux1873xnibdui` or `name@email.com` replace with your verifier id(sub or email)'s value.
        subVerifierInfoArray: [
          {
            idToken: curSession.getIdToken().getJwtToken(),
            verifier: web3AuthConfig.subVerifier,
          },
        ],
      })
      .catch((e) => {
        console.log("Failed to connect to web3", e);
      });
    if (!provider) {
      console.log("No provider");
      thunkAPI.dispatch(setIsUserLoading(false));
      return;
    }
    const pKey: any = await provider.request({ method: "eth_private_key" });
    // The private key returned here is the CoreKitKey
    console.log("ETH Private Key", pKey);

    if (!pKey) {
      thunkAPI.dispatch(setIsUserLoading(false));
      return;
    }
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("kaiju_pkey", pKey);
      }
      const apiParams = selectAPIParams(thunkAPI.getState());
      const signer = new Wallet(pKey);
      const accountAPI = new GAccountAPI({
        accountFactory: apiParams.accountFactory,
        entryPointAddress: apiParams.entryPointAddress,
        provider: apiParams.provider,
        providerUrl: apiParams.providerUrl,
        bundler: apiParams.bundler,
        privateKey: pKey,
      });
      const counterFactualAddress = await accountAPI.getAccountAddress();
      thunkAPI.dispatch(
        setAccountAddress({
          eoaAddress: signer.address,
          aaAddress: counterFactualAddress,
        })
      );
    } catch (e) {
      console.log(e);
    }

    thunkAPI.dispatch(setIsUserLoading(false));
    thunkAPI.dispatch(changeWalletInitlized(true));
  }
);

export const fetchBalances = createAsyncThunk(
  "wallet/fetchBalances",
  async (_, thunkAPI) => {
    try {
      console.debug("Fetching balances thunk");
      const state = thunkAPI.getState();
      const selectedNetwork = selectActiveNetwork(state);
      const address = selectAccountAddress(state);
      if (!address) {
        return;
      } else {
        const newBalances: AssetsBalances = {};
        const proms = selectedNetwork.assets.map(async (val, ind) => {
          if (val.isDisabled) {
            return;
          }
          let bal: BigNumber;
          if (ind === selectedNetwork.baseAssetIndex) {
            bal = await GAccountAPI.getNativeBalance(
              address,
              selectedNetwork.provider
            );
          } else {
            console.info(val.contractAddress);
            bal = await GAccountAPI.getERC20TokenBalance(
              address,
              selectedNetwork.provider,
              val.contractAddress!
            );
          }
          newBalances[val.id] = {
            address: address,
            dataSource: "local",
            retrievedAt: Date.now(),
            assetAmount: {
              coin: formatUnits(bal, val.decimals),
              currency: "$",
              rate: 0,
              value: 0,
            },
          };
        });
        await Promise.all(proms);
        thunkAPI.dispatch(updateBalances({ balances: newBalances }));
      }
    } catch (e) {
      console.error("fetchBalances Error:", e);
    }
  }
);

export const { setWallet, removeWallet, setAccountAddress, updateBalances } =
  walletSlice.actions;

export const selectWalletState = (state: any) => {
  return state.wallet as WalletState;
};
export const selectWalletAccount = (state: any) =>
  state.wallet.account as WalletState["account"];
export const selectAccountAddress = (state: any) =>
  (state.wallet.account?.address as WalletState["account"]["address"])
    ?.aaAccountAddress;

export const selectAllAssetsForNet = (state: any) =>
  (state.wallet.supportedNetworks[state.wallet.activeNetworkId] as Network)
    .assets;
export const selectPrimaryAsset = (state: any) => {
  if (!state.wallet.supportedNetworks) {
    return;
  }
  const net = state.wallet.supportedNetworks[
    state.wallet.activeNetworkId
  ] as Network;
  return net.assets[net.primaryAssetIndex];
};
export const selectIsWalletLoading = (state: any) =>
  state.wallet.isWalletLoading;
export const selectActiveNetwork = (state: any) =>
  state.wallet.supportedNetworks[state.wallet.activeNetworkId] as Network;
export const selectAPIParams = (state: any) => {
  const activeNet = selectActiveNetwork(state);
  const walletState = selectWalletState(state);
  const provider = new JsonRpcBatchProvider(activeNet.provider);
  const bundler = new HttpRpcClient(
    activeNet.bundler,
    walletState.entryPointAddress,
    activeNet.chainID
  );
  return {
    entryPointAddress: walletState.entryPointAddress,
    providerUrl: activeNet.provider,
    provider,
    bundler,
    accountFactory: walletState.accountFactoryAddress,
    ownerAddress: walletState.account.address?.eoaAccountAddress,
  };
};
export const selectAccountBalances = (state: any) =>
  state.wallet.account.balances as AssetsBalances;
export default walletSlice.reducer;
