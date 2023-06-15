import { useEffect } from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AuthProvider from "@/provider/AuthProvider";
import { wrapper } from "@/redux/store";
import { Box, Grid } from "@mui/material";
import Lottie from "react-lottie";
import * as animationData from "../assets/animations/loading.json";
import Loader from "@/components/molecules/Loader";
export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);

  const { pageProps } = props;

  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={<Loader />}>
        <AuthProvider>
          <div>
            <main style={{ display: "flex" }}>
              <Component {...pageProps} />
            </main>
          </div>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
