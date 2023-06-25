import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "./storage";
import { persistReducer, persistStore } from "redux-persist";
import { createWrapper } from "next-redux-wrapper";
import wallet from "./slices/wallet";
import user from "./slices/user";
import { Amplify, Auth } from "aws-amplify";
import awsConfig from "../config/awsconfig";
import web3AuthConfig from "../config/web3authconfig";
import Web3Auth from "@web3auth/single-factor-auth";
import transaction from "./slices/transaction";
import gameData from "./slices/game";
import modals from "./slices/modals";
import { listenerMiddleware } from "./middleware/listeners";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const rootReducer = combineReducers({
  wallet,
  user,
  transaction,
  modals,
  gameData,
});
const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
  });

export type RootState = ReturnType<typeof rootReducer>;
export type ExtraAgs = {
  apiHeaders: Headers;
  awsAuth: typeof Auth;
  web3auth: Web3Auth;
};
export const makeStore = () => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return makeConfiguredStore();
  } else {
    // we need it only on client side
    // Configuration of Service Provider

    // Configuration of Modules
    Amplify.configure({
      Auth: {
        // (required) only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: awsConfig.identityPoolId,

        // (required)- Amazon Cognito Region
        region: awsConfig.region,

        // (optional) - Amazon Cognito Federated Identity Pool Region
        // Required only if it's different from Amazon Cognito Region
        identityPoolRegion: awsConfig.identityPoolRegion,

        // (optional) - Amazon Cognito User Pool ID
        userPoolId: awsConfig.userPoolId,

        // (optional) - Amazon Cognito Web Client ID (26-char alphanumeric string, App client secret needs to be disabled)
        userPoolWebClientId: awsConfig.userPoolWebClientId,

        // (optional) - Hosted UI configuration
        oauth: awsConfig.oauth,
      },
    });

    const web3auth: any = new Web3Auth({
      clientId: web3AuthConfig.clientId, // Get your Client ID from Web3Auth Dashboard
      chainConfig: {
        chainNamespace: web3AuthConfig.chainConfig.chainNamespace as any,
        chainId: web3AuthConfig.chainConfig.chainId,
        rpcTarget: web3AuthConfig.chainConfig.rpcTarget,
      },
      web3AuthNetwork: web3AuthConfig.web3AuthNetwork as any,
    });
    const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
      config: {
        chainConfig: {
          chainId: web3AuthConfig.chainConfig.chainId,
          rpcTarget: web3AuthConfig.chainConfig.rpcTarget,
          displayName: "",
          blockExplorer: "",
          ticker: "",
          tickerName: "",
        },
      },
    });
    web3auth.init(ethereumPrivateKeyProvider);
    const persistConfig = {
      key: "nextjs",
      storage,
      whitelist: ["wallet", "user", "network", "gameData"],
    };
    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const apiHeaders = new Headers();
    let store: any = configureStore({
      reducer: persistedReducer,
      devTools: process.env.NODE_ENV !== "production",
      middleware: (getDefaultMiddleware) => {
        const middleware = getDefaultMiddleware({
          serializableCheck: false,
          thunk: { extraArgument: { awsAuth: Auth, web3auth, apiHeaders } },
        });
        return middleware.prepend(listenerMiddleware.middleware);
      },
    });
    store.__persistor = persistStore(store); // Nasty hack
    return store;
  }
};
export type ReduxStoreType = ReturnType<typeof makeStore>;
export type AppDispatch = ReduxStoreType["dispatch"];

export const wrapper = createWrapper<ReduxStoreType>(makeStore);
