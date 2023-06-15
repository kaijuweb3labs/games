import {
  UserState,
  fetchUserDetails,
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
  const [isPublicRoute, setIsPublicRoute] = useState(false);
  const userState: UserState = useSelector(selectUser);

  console.log(userState);
  useEffect(() => {
    dispatch(initAuth()).then(() => {
      setisInitialized(true);
    });
  }, [dispatch]);
  const authCheck = useCallback(
    async (url: string) => {
      // redirect to login page if accessing a private page and not logged
      // Initialization of Service Provider
      if (userState.uid) {
        return;
      }
      const publicPaths = ["/login", "/2048"];
      const path = url.split("?")[0];
      if (path.includes("#state")) {
        // await dispatch(authCallback(path));
        // window.close();
        return;
      }
      console.log("Call auth callback", path);
      if (publicPaths.includes(path)) {
        console.log("Public Route");
        setIsPublicRoute(true);
      }
      if (!userState.uid && !publicPaths.includes(path)) {
        console.log("No user in private route");
        router.push({
          pathname: "/2048",
          query: { returnUrl: router.asPath },
        });
      }
    },
    [router, userState.uid]
  );

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setIsPublicRoute(false);
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
        }
      }
    );

    return unsubscribe;
  }, [dispatch, router]);

  return isInitialized ? (
    userState.uid || isPublicRoute ? (
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
