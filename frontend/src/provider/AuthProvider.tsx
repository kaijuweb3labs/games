import {
  UserState,
  initAuth,
  initializeUser,
  selectUser,
} from "@/redux/slices/user";
import { AppDispatch } from "@/redux/store";
import { Hub } from "aws-amplify";

import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/molecules/Loader";
const AuthProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [isInitialized, setisInitialized] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isHideRoute, setHide] = useState(false);
  const userState: UserState = useSelector(selectUser);

  // console.log(userState);
  useEffect(() => {
    dispatch(initAuth()).then(() => {
      setisInitialized(true);
    });
  }, [dispatch]);
  const authCheck = useCallback(
    async (url: string) => {
      const path = url.split("?")[0];

      if (userState.uid && path.includes("login")) {
        router.push({
          pathname: "/2048",
          query: { returnUrl: router.asPath },
        });
      }
      setHide(false);
    },
    [router, userState.uid]
  );

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setHide(true);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCheck]);

  useEffect(() => {
    const unsubscribe = Hub.listen(
      "auth",
      async ({ payload: { event, data } }) => {
        // console.log(event, data);
        switch (event) {
          case "signIn":
            const isUser = await dispatch(initializeUser());
            // await dispatch(initializeWallet());
            if (isUser) {
              router.push({
                pathname: "/2048",
              });
            }
            break;
          case "signOut":
            break;
          case "customOAuthState":
            break;
        }
      }
    );

    return unsubscribe;
  }, [dispatch, router]);

  return isInitialized ? (
    userState.uid || !isHideRoute ? (
      <>
        {userState.isLoading && <Loader />}
        {children}
      </>
    ) : (
      <Loader />
    )
  ) : (
    <Loader />
  );
};

export default AuthProvider;
