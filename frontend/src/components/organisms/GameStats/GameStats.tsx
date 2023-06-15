import { useGameContext } from "@/hooks/useGameContext";
import { useSelector } from "react-redux";

import { Tile } from "../../interfaces";
import {
  changeNFTMinting,
  changeSessionNFTMinted,
  selectUser,
  selectsessionNFTMinted,
} from "@/redux/slices/user";
import useGameLocalStorage from "@/hooks/useLocalStorage";
import { getMaxId } from "@/utils/boardUtils";
import { TEST } from "@/config";
import { useCallback, useEffect, useState } from "react";
import styles from "./GameStats.module.scss";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { checkScoreValidation } from "@/redux/slices/transaction";
import { selectAccountAddress } from "@/redux/slices/wallet";
import {
  GameStageEnum,
  getPersonalBest,
  updateGameStage,
} from "@/redux/slices/game";
import MintNftModal from "../Modals/MintNftModal";
export type ACTIONTYPE = {
  type: "change" | "personalBest";
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
  //console.log('ScoresContainer initState.......')
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
        !state.tiles.every((t) => containsTile(tiles, t))
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
        if (
          action.payload.status == "GAME_OVER" ||
          action.payload.status == "WIN"
        ) {
          if (state.score >= state.bestScore || TEST) {
            let ev2 = new CustomEvent(action.payload.status, {
              detail: { score: state.score },
            });
            window.dispatchEvent(ev2);
          }
        }
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
      if (
        action.payload.status == "GAME_OVER" ||
        action.payload.status == "WIN"
      ) {
        if (score >= bestScore || TEST) {
          let ev2 = new CustomEvent(action.payload.status, {
            detail: { score: score },
          });
          window.dispatchEvent(ev2);
        }
      }
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
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const GameStats: React.FC = () => {
  const { gameState } = useGameContext();
  const address = useSelector(selectAccountAddress);
  const isSwssionNFTMInted = useReduxSelector(selectsessionNFTMinted);
  const [gameLoading, setGameLoading] = useState(Boolean);
  const [loadNewGameWindow, setNewGameWindow] = useState(true);
  const user = useReduxSelector(selectUser);
  const [nftMint, setNftMint] = useState(false);
  const reduxDispatch = useReduxDispatch();
  const [state, dispatch] = useGameLocalStorage(
    "scores",
    initState(),
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
  }, [address]);

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

  const mintNftAccept = useCallback(() => {
    console.log("Minting the NFT..............");
    reduxDispatch(
      checkScoreValidation({ gameMoves: gameState.moves, score: state.score })
    );
    reduxDispatch(changeNFTMinting(true));
    reduxDispatch(updateGameStage(GameStageEnum.PENDING));
    setNftMint(false);
  }, [state.score, gameState.moves]);

  const mintNftClose = useCallback(() => {
    console.log("Dont mint and Return to New Game.");
    setNftMint(false);
    reduxDispatch(updateGameStage(GameStageEnum.PENDING));
    reduxDispatch(changeSessionNFTMinted(true));
  }, []);

  useEffect(() => {
    console.log("Game Status In UseEffect::::::::::::::", state.status);
    if (state.status === "GAME_OVER" && !isSwssionNFTMInted) {
      setNewGameWindow(true);
      reduxDispatch(updateGameStage(GameStageEnum.MINTING));
      setNftMint(true);
    }
  }, [state.status]);
  return (
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
            <h1 className="text-[14px] font-bold text-white">{state.score}</h1>
            <h1 className="text-[10px] font-medium text-[#8C8EA6]">
              Current Score
            </h1>
          </div>
        </div>
        <div className="flex flex-row items-center space-x-[8px] ml-[16px]">
          <div className="p-[6px] bg-[#F4BB76] shadow-sm rounded-[10px]">
            <img src="/trophy.svg" alt="Trophy" className="h-[16px] w-[16px]" />
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
        {nftMint && (
          <MintNftModal
            mintNft={mintNftAccept}
            closeMint={mintNftClose}
          ></MintNftModal>
        )}
      </>
    </div>
  );
};

export default GameStats;
