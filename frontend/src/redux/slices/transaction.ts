import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EthersTransactionRequest } from "@/types/transaction";
import { UserOperationStruct } from "@account-abstraction/contracts";
import {
  IAction,
  changeNewGamePressed,
  selectAuthHeaders,
  setRandomSeed,
  setScoreValiedState,
} from "./user";

import GAccountAPI from "@/services/packages/account-api";
import Config from "../../config/exconfig";
import { TransactionReceipt } from "@ethersproject/providers";
import { selectAPIParams, selectAccountAddress } from "./wallet";
import { BASE_API_URL } from "@/config";
import { GameStageEnum, fetchLeaderBoard, selectGameSessionData, updateGameStage } from "./game";
import {
  getByteCode,
  getNftMetadataUrl,
  updateGame,
} from "@/services/game-api/game-api";
import { KaijuGameFactory__factory } from "@/contracts/factories/game-2048";
import { AddressZero } from "@ethersproject/constants";
import { BigNumber } from "@ethersproject/bignumber";
import { encodeGameMoves } from "@/utils/helpers/encode";
import { useReduxSelector } from "../hooks";

const gasEstimations = {
  mintNft: {
    verificationGasLimit: 255000,
  },
};

export type TransactionState = {
  openTransactionModal: boolean;
  transactionStage: string;
  transactionRequest?: EthersTransactionRequest;
  requestOrigin?: string;
  userOperationRequest?: Partial<UserOperationStruct>;
  unsignedUserOperation?: UserOperationStruct;
  transactionReceipt?: TransactionReceipt;
};

export const initialState: TransactionState = {
  openTransactionModal: false,
  transactionStage: "first",
  transactionRequest: undefined,
  userOperationRequest: undefined,
  unsignedUserOperation: undefined,
  transactionReceipt: undefined,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactionModal: (state, action: IAction<boolean>) => {
      // console.log("Dispatch openTransaction Modal");
      state.openTransactionModal = action.payload;
    },
    setTransactionStage: (state, action: IAction<string>) => {
      // console.log("Dispatch openTransaction Modal");
      state.transactionStage = action.payload;
    },
    setUnsignedUserOperation: (
      state,
      { payload }: { payload: UserOperationStruct }
    ) => ({
      ...state,
      unsignedUserOperation: payload,
    }),
    sendUserOperationRquest: (
      state,
      { payload }: { payload: UserOperationStruct }
    ) => ({
      ...state,
      userOperationRequest: payload,
    }),
    sendTransactionRequest: (
      state,
      {
        payload: { transactionRequest },
      }: {
        payload: {
          transactionRequest: EthersTransactionRequest;
        };
      }
    ) => {
      return {
        ...state,
        transactionRequest: transactionRequest,
      };
    },
    setTransactionReceipt: (
      state,
      {
        payload: { transactionReceipt },
      }: {
        payload: {
          transactionReceipt: TransactionReceipt;
        };
      }
    ) => {
      return {
        ...state,
        transactionReceipt: transactionReceipt,
      };
    },
    removeTransactionAndUserOp: (state, action: IAction<undefined>) => {
      return {
        ...state,
        transactionRequest: undefined,
        userOperationRequest: undefined,
      };
    },
    removeTransactionReceipt: (state, action: IAction<undefined>) => {
      return { ...state, transactionReceipt: undefined };
    },
  },
});

export const createGameRandom = createAsyncThunk(
  "transactions/setRandomSeed",
  async ({ gameId }: { gameId: string }, { dispatch, getState }) => {
    const state = getState() as any;
    const accountApiParams = selectAPIParams(state);
    const providerUrl = accountApiParams.providerUrl;
    const provider = accountApiParams.provider;
    const bundler = accountApiParams.bundler;
    const entryPointAddress = accountApiParams.entryPointAddress;
    const privateKey = window.localStorage.getItem("kaiju_pkey");
    const factoryAddress = Config.factory_address;
    const gameFactoryAddress = Config.game_factory_address;
    const accountAddress = selectAccountAddress(state);

    if (!privateKey) {
      console.error("No private Key Config");
    }
    if (!gameId) {
      console.error("Game ID Not found", gameId);
    }
    const accountAPI = new GAccountAPI({
      providerUrl,
      provider,
      entryPointAddress,
      privateKey,
      accountFactory: factoryAddress,
      bundler,
    });
    accountAPI.paymasterAPI.setPaymaster(
      `${BASE_API_URL}common/verifyPaymasterData`,
      () => selectAuthHeaders()
    );
    const gameFactory = KaijuGameFactory__factory.connect(
      gameFactoryAddress,
      provider
    ).connect(AddressZero);
    const target = gameFactoryAddress;

    const data = gameFactory.interface.encodeFunctionData("getRandomNumber", [
      gameId,
    ]);

    try {
      const userOp = await accountAPI.createUnsignedUserOp({
        target: target,
        data: data,
      });

      const signedUserOp = await accountAPI.signUserOp(userOp);
      const receipt = await accountAPI.sendUserOp(signedUserOp);
      console.log("Trasaction Resipt:", receipt);

      let randomNumber: number;

      try {
        if (receipt.status == 1) {
          for (let i = 0; i < receipt.logs.length; i++) {
            if (receipt.logs[i].address == gameFactoryAddress) {
              const eventData = gameFactory.interface.decodeEventLog(
                "GetRandomNumber(string indexed _gameID, uint256 _randomNumber)",
                receipt.logs[i].data,
                receipt.logs[i].topics
              );
              randomNumber = BigNumber.from(eventData._randomNumber).toNumber();
              break;
            }
          }
          // console.log("Random Seed of", gameId, ":", randomNumber);
          dispatch(setRandomSeed({ randomSeed: randomNumber }));
          dispatch(updateGameStage(GameStageEnum.INITIALIZED));
        } else {
          console.error("Transaction failed on executing");
          dispatch(changeNewGamePressed(false));
        }
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  }
);

export const checkScoreValidation = createAsyncThunk(
  "transactions/checkScoreValidation",
  async (
    { gameMoves, score }: { gameMoves?: number[]; score?: number },
    { dispatch, getState }
  ) => {
    const state = getState() as any;
    const headers = await selectAuthHeaders(state);
    const accountApiParams = selectAPIParams(state);
    const providerUrl = accountApiParams.providerUrl;
    const provider = accountApiParams.provider;
    const bundler = accountApiParams.bundler;
    const entryPointAddress = accountApiParams.entryPointAddress;
    const privateKey = window.localStorage.getItem("kaiju_pkey");
    const factoryAddress = accountApiParams.accountFactory;
    const gameFactoryAddress = Config.game_factory_address;
    const accountAddress = selectAccountAddress(state);

    const gameID: string = state.user.gameId;

    if (!gameID) {
      console.error("Game ID Failed.....", gameID);
    }

    if (!score) {
      console.error("Score is Not Awailable...", score);
    }
    const accountAPI = new GAccountAPI({
      providerUrl,
      provider,
      entryPointAddress,
      privateKey,
      accountFactory: factoryAddress,
      bundler,
    });

    accountAPI.paymasterAPI.setPaymaster(
      `${BASE_API_URL}common/verifyPaymasterData`,
      () => selectAuthHeaders()
    );

    const gameFactory = KaijuGameFactory__factory.connect(
      gameFactoryAddress,
      provider
    ).connect(AddressZero);
    const target = gameFactoryAddress;

    try {
      let fetchedUid: any = await getNftMetadataUrl(
        {
          score: score,
          gameId: gameID,
          playerName: state.user.displayName,
          date: state.gameData.singaporeDate,
        },
        headers
      );

      if (!fetchedUid) {
        console.error("Metadata Fetch Failed......", fetchedUid);
      }
      const encodedData = encodeGameMoves(gameMoves);
      let byteCode = await getByteCode(
        {
          gameId: gameID,
          FEScore: score,
          origMovesLength: gameMoves.length,
          movesPerVar: encodedData.movesPerVar,
          movesEncodedLength: encodedData.encodedMoves.length,
          movesEncoded: encodedData.encodedMoves,
        },
        headers
      );

      if (byteCode) {
        // console.log("ByteCode:::::", byteCode, byteCode.length);
        if (byteCode.length % 2 !== 0) {
          console.log("Refactoring ByteCode Length to even... [Add 0 to tail]")
          byteCode += "0";
        }
      } else {
        console.error("getByteCode Fetching Failed.");
      }

      // console.log("meta Data Url:", fetchedUid);
      const data = gameFactory.interface.encodeFunctionData("verify2048game", [
        gameID,
        score,
        byteCode,
        fetchedUid,
      ]);

      const userOp = await accountAPI.createUnsignedUserOp({
        target: target,
        data: data,
        verificationGasLimit: gasEstimations.mintNft.verificationGasLimit,
      });

      const signedUserOp = await accountAPI.signUserOp(userOp);

      const receipt = await accountAPI.sendUserOp(signedUserOp);

      //console.log(`Transaction hash: ${receipt.transactionHash}`);
      console.log("Transaction Recipt:", receipt);

      let isValied: boolean;
      let contractScore: number;
      try {
        if (receipt.status == 1) {
          for (let i = 0; i < receipt.logs.length; i++) {
            if (receipt.logs[i].address == gameFactoryAddress) {
              const eventData = gameFactory.interface.decodeEventLog(
                "Verify2048Game(string indexed _gameId, bool _isValid, uint256 _FEScore, uint256 _contractScore)",
                receipt.logs[i].data,
                receipt.logs[i].topics
              );
              isValied = eventData._isValid;
              contractScore = 0;
              break;
            }
          }

          console.log("Game Data of the Session:", {
            gameID: gameID,
            randomNumber: state.user.randomSeed,
            FEScore: score,
            contractScore: contractScore,
            moves: gameMoves,
            movesPerVar: encodedData.movesPerVar,
          });

          dispatch(setScoreValiedState({ isScoreValied: isValied }));

          dispatch(updateGameStage(GameStageEnum.MINTED));

          try {
            let gameSession = state.gameData.gameSessionData
            let gameValidateUpdate: any = await updateGame(
              {
                gameID: gameID,
                gameSession: gameSession,
                transactionHash: receipt.transactionHash,
                FEScore: score,
                contractScore: contractScore,
                isValid: isValied,
              },
              headers
            );
          } catch (e) {
            console.error("Failed to Update Backend", e);
          }
          dispatch(fetchLeaderBoard());
        } else {
          console.error("Transaction failed on executing");
          dispatch(updateGameStage(GameStageEnum.PENDING));
        }
      } catch (e) {
        console.error(e);
        dispatch(updateGameStage(GameStageEnum.PENDING));
      }
    } catch (e) {
      console.error(e);
      dispatch(updateGameStage(GameStageEnum.PENDING));
    }
  }
);

export const {
  setTransactionModal,
  setUnsignedUserOperation,
  sendTransactionRequest,
  setTransactionStage,
  removeTransactionAndUserOp,
  setTransactionReceipt,
  removeTransactionReceipt,
} = transactionSlice.actions;
export const selectOpenTransactionModal = (state: any) =>
  state.transaction.openTransactionModal;
export const selectTransactionStage = (state: any) =>
  state.transaction.transactionStage;
export const selectCurrentPendingSendTransactionUserOp = (state: any) =>
  state.transaction.unsignedUserOperation;
export const selectCurrentPendingSendTransaction = (state: any) =>
  state.transaction.transactionRequest;
export const selectTransactionReceipt = (state: any) =>
  state.transaction.transactionReceipt;
export default transactionSlice.reducer;
