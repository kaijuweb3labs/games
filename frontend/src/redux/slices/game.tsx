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
import { createNewGame, selectAuthHeaders, selectUser } from "./user";

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
export enum GameStageEnum {
  PENDING,
  INITIALIZING,
  PLAYING,
  MINTING,
}
interface GameDataState {
  gameFactoryAddress: string;
  leaderBoard: LeaderBoardItem[];
  personalBest: number;
  gameStage: GameStageEnum;
}

const INITIAL_STATE: GameDataState = {
  gameFactoryAddress: exconfig.game_factory_address,
  leaderBoard: [],
  personalBest: 0,
  gameStage: GameStageEnum.PENDING,
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
  },
});

export const fetchLeaderBoard = createAsyncThunk(
  "gameData/fetchLeaderBoard",
  async (_, thunkAPI) => {
    try {
      console.log("Fetching leader board...........");
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
              gameID: l.gameID,
              score: l.score.toNumber(),
            }));
            getLeaderBoardAPI(gameIds).then((v) => {
              thunkAPI.dispatch(setLeaderBoard(v));
            });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } catch (e) {
      console.log("failed to fetch leaderboard");
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
      console.log("Create game session...............");
      const state = thunkAPI.getState();
      const user = selectUser(state);
      const headers = selectAuthHeaders(state);
      createGameSession(user.uid, user.displayName, user.picture, headers).then(
        (data) => {
          thunkAPI.dispatch(
            createNewGame({ gameId: data.id, score: data.score })
          );
          console.log("Created new game session", data);
        }
      );
    } catch (e) {
      console.error("Error:", e);
    }
  }
);
export const { resetGame, setLeaderBoard, setPersonalBest, updateGameStage } =
  gameSlice.actions;

export const selectPersonalBest = (state: any) =>
  state.gameData.personalBest as number;

export const selectLeaderBoard = (state: any) =>
  state.gameData.leaderBoard as LeaderBoardItem[];
export const selectGameStage = (state: any) =>
  state.gameData.gameStage as GameStageEnum;
export default gameSlice.reducer;
