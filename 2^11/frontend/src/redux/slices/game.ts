import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import exconfig from "@/config/exconfig";
import { selectAccountAddress, selectActiveNetwork } from "./wallet";
import { KaijuGameFactory__factory } from "@/contracts/factories/game-2048/KaijuGameFactory__factory";
import { JsonRpcProvider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import {
  createGameSession,
  getLeaderBoardAPI,
} from "@/services/game-api/game-api";
import { createNewGame, selectAuthHeaders, selectUser, setGameSession, setRandomSeed } from "./user";

export type LeaderBoardItem = {
  _id: string;
  userID: string;
  profileName: string;
  profilePicture: string;
  collectionID: string;
  createdTimeStamp: number;
  score: number;
  gameState: string;
  transactionHash: string;
  gamePositionHistory: [];
  gameID: string;
};

export type GameSessionData = {
  userID: string;
  profileName: string;
  profilePicture: string;
  collectionID: string;
  gameID: string;
  createdTimeStamp: number;
  FEScore: number;
  contractScore: number;
  isValid: boolean;
  gameState: string;
  transactionHash: string;
  gamePositionHistory: string[];
};

export enum GameStageEnum {
  PENDING,
  INITIALIZING,
  INITIALIZED,
  PLAYING,
  MINTING,
  MINT,
  MINTED,
}
interface GameDataState {
  gameFactoryAddress: string;
  leaderBoard: LeaderBoardItem[];
  personalBest: number;
  gameStage: GameStageEnum;
  singaporeDate: string;
  gameSessionData?: GameSessionData;
}

const INITIAL_STATE: GameDataState = {
  gameFactoryAddress: exconfig.game_factory_address,
  leaderBoard: [],
  personalBest: 0,
  gameStage: GameStageEnum.PENDING,
  singaporeDate: "",
  gameSessionData: undefined,
};
export const gameSlice = createSlice({
  name: "gameData",
  initialState: INITIAL_STATE,
  reducers: {
    setLeaderBoard: (state, action: PayloadAction<LeaderBoardItem[]>) => {
      state.leaderBoard = action.payload;
    },
    resetGame: (_, __: PayloadAction<undefined>) => {
      return { ...INITIAL_STATE };
    },
    setPersonalBest: (state, action: PayloadAction<number>) => {
      state.personalBest = action.payload;
    },
    updateGameStage: (state, action: PayloadAction<GameStageEnum>) => {
      state.gameStage = action.payload;
    },
    setSingaporeDate: (state, action: PayloadAction<string>) => {
      state.singaporeDate = action.payload;
    },
    setGameSessionData: (state, action: PayloadAction<GameSessionData>) => {
      state.gameSessionData = action.payload;
    },
  },
});

export const fetchLeaderBoard = createAsyncThunk(
  "gameData/fetchLeaderBoard",
  async (_, thunkAPI) => {
    try {
      // console.log("Fetching leader board...........");
      const state = thunkAPI.getState();
      const selectedNetwork = selectActiveNetwork(state);
      if (selectedNetwork) {
        const KaijuGame = KaijuGameFactory__factory.connect(
          exconfig.game_factory_address,
          new JsonRpcProvider(selectedNetwork.provider)
        ).connect(AddressZero);
        KaijuGame.callStatic
          .getLeaderBoard()
          .then((leaderBoard) => {
            const gameIds = leaderBoard.map((l) => ({
              gameID: l.gameId,
              score: l.score.toNumber(),
            }));
            getLeaderBoardAPI(gameIds).then((v) => {
              thunkAPI.dispatch(setLeaderBoard(v));
            });
          })
          .catch((e) => {
            thunkAPI.dispatch(setLeaderBoard([]));
            console.error(e);
          });
      }
    } catch (e) {
      console.error("failed to fetch leaderboard");
    }
  }
);

export const getPersonalBest = createAsyncThunk(
  "gameData/personalBest",
  async (_, thunkAPI): Promise<number | undefined> => {
    try {
      console.debug("Fetching leader board");
      const state = thunkAPI.getState();
      const selectedNetwork = selectActiveNetwork(state);
      const address = selectAccountAddress(state);
      if (selectedNetwork && address) {
        const KaijuGame = KaijuGameFactory__factory.connect(
          exconfig.game_factory_address,
          new JsonRpcProvider(selectedNetwork.provider)
        ).connect(AddressZero);
        const persBest = await KaijuGame.callStatic.getPersonalBest(address);
        return persBest.toNumber();
      }
    } catch (e) {
      console.error("fetchBalances Error:", e);
    }
  }
);
export const createGameSessionThunk = createAsyncThunk(
  "gameData/createGameSession",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const user = selectUser(state);
      const headers = await selectAuthHeaders(state);
      createGameSession(user.uid, user.displayName, user.picture, headers).then(
        (data) => {
          thunkAPI.dispatch(setGameSessionData(data));
          thunkAPI.dispatch(setGameSession({ gameId:data.id, score:data.FEScore}));
          thunkAPI.dispatch(setRandomSeed({ randomSeed: data.randomNumber }));
          thunkAPI.dispatch(updateGameStage(GameStageEnum.INITIALIZED));
          // thunkAPI.dispatch(
          //   createNewGame({ gameId: data.id, score: data.score })
          //);
        }
      );
    } catch (e) {
      console.error("Error:", e);
    }
  }
);
export const {
  resetGame,
  setLeaderBoard,
  setPersonalBest,
  updateGameStage,
  setSingaporeDate,
  setGameSessionData,
} = gameSlice.actions;

export const selectPersonalBest = (state: any) =>
  state.gameData.personalBest as number;
export const selectLeaderBoard = (state: any) =>
  state.gameData.leaderBoard as LeaderBoardItem[];
export const selectGameStage = (state: any) =>
  state.gameData.gameStage as GameStageEnum;
export const selectGameSessionData = (state: any) =>
  state.gameData.gameSessionData as GameSessionData;
export default gameSlice.reducer;
