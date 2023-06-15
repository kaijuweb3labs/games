import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { initializeWallet, removeWallet } from "./wallet";
import { Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { createGameRandom } from "./transaction";
import { UserDetails } from "@/types/user";
import { GAME_ID } from "@/hooks/useLocalStorage";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { ExtraAgs } from "../store";
import { resetGame } from "./game";

export interface UserState {
  isLoading: boolean | undefined;
  email: string | undefined;
  uid: string | undefined;
  displayName: string | undefined;
  bestScore?: number;
  gameStatus?: "win" | "game_over" | "pending";
  gameId?: string;
  score?: number;
  picture?: string;
  randomSeed?: number | undefined;
  isScoreValied?: boolean | undefined;
  isScoreChecked?: boolean | undefined;
  newGamePressed?: boolean | undefined;
  initializedWallet?: boolean | undefined;
  isUserPlayGame?: boolean | undefined;
  nftMinting?: boolean | undefined;
  sessionNFTMinted?: boolean | undefined;
  userDetails?: UserDetails;
  accessToken?: string;
  idToken?: string;
}

export interface IAction<T = any> {
  type: string;
  payload: T;
}
const INITIAL_STATE: UserState = {
  email: undefined,
  uid: undefined,
  isLoading: true,
  displayName: undefined,
  bestScore: 0,
  gameId: undefined,
  gameStatus: "pending",
  randomSeed: undefined,
  isScoreValied: undefined,
  isScoreChecked: undefined,
  newGamePressed: undefined,
  initializedWallet: undefined,
  isUserPlayGame: undefined,
  nftMinting: undefined,
  sessionNFTMinted: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    setUser: (state, action: IAction<UserState>) => {
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.isLoading = action.payload.isLoading;
      state.displayName = action.payload.displayName;
      state.picture = action.payload.picture;
      state.accessToken = action.payload.accessToken;
      state.idToken = action.payload.idToken;
    },
    setUserDetails: (state, action: IAction<UserDetails>) => {
      state.userDetails = action.payload;
    },
    setScore: (
      state,
      action: IAction<{
        score: number;
        status?: "win" | "game_over" | "pending";
      }>
    ) => {
      state.bestScore = action.payload.score;
      if (action.payload.status) {
        state.gameStatus = action.payload.status;
      }
    },
    setGameSession: (
      state,
      action: IAction<{ gameId: string; score: number }>
    ) => {
      state.gameId = action.payload.gameId;
      state.score = action.payload.score;
    },
    resetGameSession: (state, action: IAction<undefined>) => {
      state.gameId = undefined;
      state.score = undefined;
      state.gameStatus = "pending";
    },
    removeUser: (state, _) => {
      // if (state.uid) {
      //   state.email = undefined;
      //   state.uid = undefined;
      // }
      return { ...INITIAL_STATE };
    },
    setIsUserLoading: (state, action: IAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRandomSeed: (state, action: IAction<{ randomSeed: number }>) => {
      state.randomSeed = action.payload.randomSeed;
      state.isScoreValied = false;
      state.isScoreChecked = false;
    },
    setScoreValiedState: (
      state,
      action: IAction<{ isScoreValied: boolean }>
    ) => {
      state.randomSeed = undefined;
      state.isScoreChecked = true;
      state.isScoreValied = action.payload.isScoreValied;
    },
    changeNewGamePressed: (state, action: IAction<boolean>) => {
      state.newGamePressed = action.payload;
    },
    changeWalletInitlized: (state, action: IAction<boolean>) => {
      state.initializedWallet = action.payload;
    },
    changeUserPLayGame: (state, action: IAction<boolean>) => {
      state.isUserPlayGame = action.payload;
    },
    changeNFTMinting: (state, action: IAction<boolean>) => {
      state.nftMinting = action.payload;
    },
    changeSessionNFTMinted: (state, action: IAction<boolean>) => {
      state.sessionNFTMinted = action.payload;
    },
  },
});

export const initializeUser = createAsyncThunk(
  "user/initializeUser",
  async (_, { dispatch }: BaseThunkAPI<any, ExtraAgs, any>) => {
    const isUser = await dispatch(fetchUserDetails());
    await dispatch(initializeWallet());
    return isUser;
  }
);

export const initAuth = createAsyncThunk(
  "user/initAuth",
  async (_, thunkAPI: BaseThunkAPI<any, ExtraAgs, any>) => {
    thunkAPI.dispatch(setIsUserLoading(true));
    const currentUser = await Auth.currentAuthenticatedUser()
      .then((currentUser) => {
        // setUser(currentUser);
        console.log(currentUser);
        return currentUser;
      })
      .catch((e) => {
        console.log("Not signed in", e);
        return null;
      });
    if (currentUser) {
      thunkAPI.dispatch(
        setUser({
          uid: currentUser.username,
          email: currentUser.signInUserSession.idToken.payload.email,
          isLoading: false,
          picture: currentUser.signInUserSession.idToken.payload.picture,
          displayName: `${currentUser.signInUserSession.idToken.payload.given_name} ${currentUser.signInUserSession.idToken.payload.family_name}`,
          accessToken: currentUser.signInUserSession.accessToken.jwtToken,
          idToken: currentUser.signInUserSession.idToken.jwtToken,
        })
      );
    } else {
      thunkAPI.dispatch(removeUser({}));
    }
    thunkAPI.dispatch(setIsUserLoading(false));
  }
);

export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setIsUserLoading(true));
    const currentUser = await Auth.currentAuthenticatedUser()
      .then((currentUser) => {
        // setUser(currentUser);
        console.log(currentUser);
        return currentUser;
      })
      .catch((e) => {
        console.log("Not signed in", e);
        return null;
      });
    if (currentUser) {
      thunkAPI.dispatch(
        setUser({
          uid: currentUser.username,
          email: currentUser.signInUserSession.idToken.payload.email,
          isLoading: false,
          picture: currentUser.signInUserSession.idToken.payload.picture,
          displayName: `${currentUser.signInUserSession.idToken.payload.given_name} ${currentUser.signInUserSession.idToken.payload.family_name}`,
          accessToken: currentUser.signInUserSession.accessToken.jwtToken,
          idToken: currentUser.signInUserSession.idToken.jwtToken,
        })
      );
      thunkAPI.dispatch(setIsUserLoading(false));
      return true;
    }
    thunkAPI.dispatch(setIsUserLoading(false));
    return false;
  }
);

export const signInUser = createAsyncThunk(
  "user/signInUser",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setIsUserLoading(true));
    await Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
    thunkAPI.dispatch(setIsUserLoading(false));
  }
);
export const signOutUser = createAsyncThunk(
  "user/signOutUser",
  async (_, thunkAPI) => {
    window?.localStorage.removeItem(GAME_ID);
    thunkAPI.dispatch(resetGame());
    thunkAPI.dispatch(setIsUserLoading(true));
    thunkAPI.dispatch(removeUser({}));
    thunkAPI.dispatch(removeWallet({}));
    await Auth.signOut();
  }
);

export const createNewGame = createAsyncThunk(
  "user/createNewGame",
  async (
    { gameId, score }: { gameId: string; score: number },
    { dispatch, getState }
  ) => {
    dispatch(setGameSession({ gameId, score }));
    dispatch(createGameRandom({ gameId }));
  }
);

export const {
  removeUser,
  setIsUserLoading,
  setUser,
  setScore,
  setGameSession,
  resetGameSession,
  setRandomSeed,
  setScoreValiedState,
  changeNewGamePressed,
  changeWalletInitlized,
  changeUserPLayGame,
  changeNFTMinting,
  changeSessionNFTMinted,
  setUserDetails,
} = userSlice.actions;
export const selectUser = (state: any) => state.user as UserState;
export const selectRandomSeed = (state: any) =>
  (state.user as UserState).randomSeed;
export const selectAuthHeaders = (state: any) => {
  const accessToken = selectUser(state).accessToken;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${accessToken}`);
  return headers;
};
export const selectUserDetails = (state: any) =>
  (state.user as UserState).userDetails;
export const selectIsScoreValied = (state: any) =>
  (state.user as UserState).isScoreValied;
export const selectIsScoreCheckd = (state: any) =>
  (state.user as UserState).isScoreChecked;
export const selectNewGamePressed = (state: any) =>
  (state.user as UserState).newGamePressed;
export const selectInitializedWallet = (state: any) =>
  (state.user as UserState).initializedWallet;
export const selectIsUserPlayGame = (state: any) =>
  (state.user as UserState).isUserPlayGame;
export const selectNftMinting = (state: any) =>
  (state.user as UserState).nftMinting;
export const selectsessionNFTMinted = (state: any) =>
  (state.user as UserState).sessionNFTMinted;
export const selectUserScore = (state: any) =>
  (state.user as UserState).bestScore;
export default userSlice.reducer;
