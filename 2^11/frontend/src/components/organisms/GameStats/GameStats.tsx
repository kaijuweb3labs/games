import { useGameContext } from "@/hooks/useGameContext";
import { useSelector } from "react-redux";
import { Tile } from "../../interfaces";
import useGameLocalStorage from "@/hooks/useLocalStorage";
import { getMaxId } from "@/utils/boardUtils";
import { useCallback, useEffect, useState } from "react";
import styles from "./GameStats.module.scss";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { selectAccountAddress } from "@/redux/slices/wallet";
import {
  GameStageEnum,
  getPersonalBest,
  selectGameStage,
  updateGameStage,
} from "@/redux/slices/game";
import MintNftModal from "../Modals/MintNftModal";
import React from "react";
export type ACTIONTYPE = {
  type: "change" | "personalBest" | "REPLACE_STATE";
  payload: any;
};

export interface ScoresState {
  score: number;
  bestScore: number;
  newPoints: number;
  tiles: Tile[];
  status: string;
}

const initState = (tiles: Tile[] = []): ScoresState => {
  // console.log("ScoresContainer initState.......");
  return {
    score: 0,
    newPoints: 0,
    bestScore: 0,
    tiles,
    status: "IN_PROGRESS",
  };
};

const containsTile = (tiles: Tile[], tile: Tile): boolean => {
  return tiles.some((t) => t.id === tile.id);
};

const stateReducer = (state: ScoresState, action: ACTIONTYPE) => {
  switch (action.type) {
    case "change": {
      const tiles = action.payload.tiles;
      //console.log(tiles);
      // handles page refresh
      if (
        state.tiles.length === tiles.length &&
        state.tiles.every((t) => containsTile(tiles, t))
      ) {
        return { ...state, status: action.payload.status };
      }

      // handles restart
      if (
        tiles.length === 2 &&
        [1, 2].every((id) => tiles.find((tile) => tile.id === id)) &&
        (!state.tiles.every((t) => containsTile(tiles, t)) ||
          state.tiles.length === 0)
      ) {
        return {
          ...initState(tiles),
          bestScore: state.bestScore,
          status: action.payload.status,
        };
      }

      // handles add new tile
      if (
        state.tiles.every((t) => containsTile(tiles, t)) &&
        tiles.length === state.tiles.length + 1
      ) {
        return {
          ...state,
          tiles: tiles,
          newPoints: 0,
          status: action.payload.status,
        };
      }

      // handles merge
      const lastGeneratedTileId = getMaxId(tiles);
      const newPoints = tiles.reduce((acc: number, curr: Tile) => {
        const add =
          curr.id === lastGeneratedTileId || containsTile(state.tiles, curr)
            ? 0
            : curr.value;
        return acc + add;
      }, 0);

      const score = state.score + newPoints;
      const bestScore = Math.max(score, state.bestScore);

      return {
        tiles,
        newPoints,
        score,
        bestScore,
        status: action.payload.status,
      };
    }
    case "personalBest": {
      return { ...state, bestScore: action.payload.bestScore };
    }
    case "REPLACE_STATE": {
      return action.payload;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};
export const GameStatsContext = React.createContext<any>(null);

const GameStats: React.FC = () => {
  const { gameState, dispatch: gameDispatch } = useGameContext();
  const address = useSelector(selectAccountAddress);
  const gameStage = useReduxSelector(selectGameStage);
  const reduxDispatch = useReduxDispatch();
  const [state, dispatch] = useGameLocalStorage(
    "scores",
    {
      score: 0,
      newPoints: 0,
      bestScore: 0,
      tiles: [],
      status: "IN_PROGRESS",
    },
    stateReducer
  );

  useEffect(() => {
    reduxDispatch(getPersonalBest()).then((v) => {
      if (v.payload) {
        dispatch({
          type: "personalBest",
          payload: { bestScore: v.payload },
        });
      }
    });
  }, [address, dispatch, reduxDispatch]);

  useEffect(() => {
    dispatch({
      type: "change",
      payload: { tiles: gameState.tiles, status: gameState.status },
    });
  }, [gameState.tiles, dispatch, gameState.status]);

  useEffect(() => {
    if (state.newPoints > 0) {
      const oldAddScore = document.getElementById("additionScore");
      oldAddScore.innerText = `+${state.newPoints}`;
      const newAddScore = oldAddScore.cloneNode(true);
      oldAddScore.parentNode.replaceChild(newAddScore, oldAddScore);
    }
  }, [state]);

  useEffect(() => {
    if (state.status === "GAME_OVER" && gameStage === GameStageEnum.PLAYING) {
      // console.log("Mint modal open");

      reduxDispatch(updateGameStage(GameStageEnum.MINT));
      gameDispatch({ type: "continue" });
    }
  }, [state.status, gameStage, reduxDispatch, gameDispatch]);

  const mintNftAccept = useCallback(() => {
    // console.log("Minting the NFT..............");
  }, []);

  const mintNftClose = useCallback(() => {
    reduxDispatch(updateGameStage(GameStageEnum.PENDING));
  }, [reduxDispatch]);

  return (
    <GameStatsContext.Provider value={{ scoreState: state, dispatch }}>
      <div className="flex flex-col md:flex-row md:items-center bg-[#1C1D29] rounded-[30px] py-[13px] px-[28px]">
        <div className="flex flex-col">
          <h1 className="text-[18px] font-bold text-white">2048</h1>
          <h1 className="text-[10px] font-medium text-[#8C8EA6]"></h1>
        </div>
        <div className="flex flex-row md:ml-auto">
          <div className="flex flex-row items-center space-x-[8px]">
            <div className="p-[6px] bg-[#C64CB8] shadow-sm rounded-[10px]">
              <img
                src="/lightening.svg"
                alt="Lightening"
                className="h-[16px] w-[16px]"
              />
            </div>
            <div className="flex flex-col relative">
              <div className={styles.addScore} id="additionScore"></div>
              <h1 className="text-[14px] font-bold text-white">
                {state.score}
              </h1>
              <h1 className="text-[10px] font-medium text-[#8C8EA6]">
                Current Score
              </h1>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-[8px] ml-[16px]">
            <div className="p-[6px] bg-[#F4BB76] shadow-sm rounded-[10px]">
              <img
                src="/trophy.svg"
                alt="Trophy"
                className="h-[16px] w-[16px]"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[14px] font-bold text-white">
                {state.bestScore}
              </h1>
              <h1 className="text-[10px] font-medium text-[#8C8EA6]">
                Personal Best
              </h1>
            </div>
          </div>
        </div>
        <>
          {gameStage === GameStageEnum.MINT &&
            state.status === "MINT_AFTER_PLAY" && (
              <MintNftModal
                show={gameStage === GameStageEnum.MINT}
                mintNft={mintNftAccept}
                closeMint={mintNftClose}
              />
            )}
        </>
      </div>
    </GameStatsContext.Provider>
  );
};

export default GameStats;
