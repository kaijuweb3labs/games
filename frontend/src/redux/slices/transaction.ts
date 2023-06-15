import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EthersTransactionRequest } from "@/types/transaction";
import { UserOperationStruct } from "@account-abstraction/contracts";
import {
  IAction,
  changeNewGamePressed,
  changeSessionNFTMinted,
  changeUserPLayGame,
  selectAuthHeaders,
  setRandomSeed,
  setScoreValiedState,
} from "./user";

import { getGasFee } from "../../utils/user-op";
import GAccountAPI from "@/services/packages/account-api";
import Config from "../../config/exconfig";
import { TransactionReceipt } from "@ethersproject/providers";
import { selectAPIParams, selectAccountAddress } from "./wallet";
import { BASE_API_URL } from "@/config";
import { fetchLeaderBoard } from "./game";
import { getNftMetadataUrl, updateGame } from "@/services/game-api/game-api";
import { KaijuGameFactory__factory } from "@/contracts/factories/game-2048";
import { AddressZero } from "@ethersproject/constants";
import { BigNumber } from "@ethersproject/bignumber";

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
      console.log("Dispatch openTransaction Modal");
      state.openTransactionModal = action.payload;
    },
    setTransactionStage: (state, action: IAction<string>) => {
      console.log("Dispatch openTransaction Modal");
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
      console.log("Set Receipt............");
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
    console.log("Creating User Op for New Game...");
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
      console.log("No private Key Config");
      return;
    } else {
      console.log("Private Key:", privateKey);
    }
    if (gameId) {
      console.log("Game ID Set:::", gameId);
    } else {
      console.log("Game ID Failed...", gameId);
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
      `${BASE_API_URL}common/verifyPaymasterData`
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
        ...(await getGasFee(provider)),
      });

      const signedUserOp = await accountAPI.signUserOp(userOp);

      const client = bundler;
      const uoHash = await client.sendUserOpToBundler(signedUserOp);
      console.log(`UserOpHash: ${uoHash}`);
      const txEvent = await accountAPI.getUserOpEventRPC(
        accountAddress,
        uoHash
      );

      const receipt = await accountAPI.getTxn(txEvent.transactionHash);
      console.log("Trasaction Resipt:", receipt);

      let randomNumber: number;

      try {
        if (receipt.status == 1) {
          console.log("Transaction Successful.");
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
          console.log("Random Seed of", gameId, ":", randomNumber);
          dispatch(setRandomSeed({ randomSeed: randomNumber }));
        } else {
          console.error("Transaction failed on executing");
          dispatch(changeNewGamePressed(false));
          dispatch(changeUserPLayGame(true));
          dispatch(changeSessionNFTMinted(false));
        }
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.log(e);
    }
  }
);

export const checkScoreValidation = createAsyncThunk(
  "transactions/checkScoreValidation",
  async (
    { gameMoves, score }: { gameMoves?: string; score?: number },
    { dispatch, getState }
  ) => {
    console.log("Creating User Op for Validation..");
    const state = getState() as any;
    const headers = selectAuthHeaders(state);
    const accountApiParams = selectAPIParams(state);
    const providerUrl = accountApiParams.providerUrl;
    const provider = accountApiParams.provider;
    const bundler = accountApiParams.bundler;
    const entryPointAddress = accountApiParams.entryPointAddress;
    const privateKey = window.localStorage.getItem("kaiju_pkey");
    const factoryAddress = accountApiParams.accountFactory;
    const gameFactoryAddress = Config.game_factory_address;
    const accountAddress = selectAccountAddress(state);

    console.log("Game Moves ::::", gameMoves);

    const gameID: string = state.user.gameId;
    if (!gameID) {
      console.log("Game ID Failed.....", gameID);
    }

    if (!score) {
      console.log("Score is Not Awailable...", score);
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
      `${BASE_API_URL}common/verifyPaymasterData`
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
        },
        headers
      );

      if (!fetchedUid) {
        console.log("Metadata Fetch Failed......", fetchedUid);
      }

      console.log("meta Data Url:", fetchedUid);
      const data = gameFactory.interface.encodeFunctionData("verify2048game", [
        gameID,
        gameMoves,
        score,
        fetchedUid,
      ]);

      const userOp = await accountAPI.createUnsignedUserOp({
        target: target,
        data: data,
        ...(await getGasFee(provider)),
      });

      console.log("User Operation: ==================== ", userOp);

      const signedUserOp = await accountAPI.signUserOp(userOp);

      const client = bundler;

      const uoHash = await client.sendUserOpToBundler(signedUserOp);
      console.log(`UserOpHash: ${uoHash}`);
      console.log("Waiting for transaction...");
      const txEvent = await accountAPI.getUserOpEventRPC(
        accountAddress,
        uoHash
      );

      const receipt = await accountAPI.getTxn(txEvent.transactionHash);

      console.log(`Transaction hash: ${txEvent.transactionHash}`);
      console.log("Contract Call is Done....");
      console.log("Transaction Recipt:", receipt);

      let isValied: boolean;
      let contractScore: number;
      try {
        if (receipt.status == 1) {
          console.log("Transaction Successful.");
          for (let i = 0; i < receipt.logs.length; i++) {
            if (receipt.logs[i].address == gameFactoryAddress) {
              const eventData = gameFactory.interface.decodeEventLog(
                "Verify2048Game(string indexed _gameID, bool _isValid, uint256 _contractScore)",
                receipt.logs[i].data,
                receipt.logs[i].topics
              );
              isValied = eventData._isValid;
              contractScore = BigNumber.from(
                eventData._contractScore
              ).toNumber();
              break;
            }
          }

          console.log(
            "Game Score Validate (from Contract):",
            isValied,
            contractScore
          );

          if (isValied && !(contractScore == score)) {
            isValied = false;
          }

          console.log("Game Validation:", isValied);
          dispatch(setScoreValiedState({ isScoreValied: isValied }));
          dispatch(fetchLeaderBoard());
          dispatch(changeSessionNFTMinted(true));

          try {
            let gameValidateUpdate: any = await updateGame(
              {
                gameID: gameID,
                transactionHash: txEvent.transactionHash,
                FEScore: score,
                contractScore: contractScore,
                isValid: isValied,
              },
              headers
            );
            console.log("Game Updated |||", gameValidateUpdate);
          } catch (e) {
            console.log("Failed to Update Backend ## ", e);
          }
        } else {
          console.error("Transaction failed on executing");
          dispatch(changeSessionNFTMinted(false));
        }
      } catch (e) {
        console.error(e);
        return null;
      }
    } catch (e) {
      console.log(e);
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
