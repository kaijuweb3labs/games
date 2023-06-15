import {
  areEqual,
  createRandomTile,
  generateBoard,
  isGameOver,
  isGameWon,
  merge,
  MOVES_MAP,
} from "../../utils/boardUtils";
import {
  GameState,
  IGameContext,
  Direction,
  Tile,
  GameStatus,
} from "../interfaces/interfaces";
import useGameLocalStorage from "../../hooks/useLocalStorage";
import { KEYBOARD_ARROW_TO_DIRECTION_MAP } from "../../constants/constants";
import router from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import {
  changeNewGamePressed,
  changeSessionNFTMinted,
  changeUserPLayGame,
  selectRandomSeed,
} from "@/redux/slices/user";
import GameStats from "./GameStats";
import { BoardContainer } from "./Board/BoardContainer";
import {
  GameStageEnum,
  selectGameStage,
  updateGameStage,
} from "@/redux/slices/game";

export const GameContext = React.createContext<IGameContext>(null);

const getGameStatus = (tiles: Tile[]): GameStatus => {
  if (isGameOver(tiles)) {
    return "GAME_OVER";
  }

  if (isGameWon(tiles)) {
    return "WIN";
  }

  return "IN_PROGRESS";
};

const initState = (tilesCount = 2, randomSeed = 1234): GameState => {
  const newTiles = generateBoard(tilesCount, randomSeed);
  return {
    tiles: newTiles,
    lastMove: null,
    status: "INITIALIZED",
    randomSeed: newTiles[1].lastRandom,
    moves: "",
    gameInitCalled: false,
  };
};

function gameReducer(state: GameState, action: any) {
  switch (action.type) {
    case "initGame": {
      return { ...state, gameInitCalled: true };
    }
    case "restart": {
      console.log("Restart}}}}}}}}}}", action);
      return initState(2, action.payload);
    }
    case "continue": {
      return { ...state, status: "PLAY_AFTER_WIN" };
    }
    case "move": {
      const move = MOVES_MAP[action.payload];
      let tiles: Tile[] = move(state.tiles);
      if (areEqual(state.tiles, tiles)) {
        return state;
      }

      tiles = merge(tiles);
      tiles = [...tiles, createRandomTile(tiles, state.randomSeed)];
      const status = getGameStatus(tiles);
      const shouldChangeStatus =
        state.status !== "PLAY_AFTER_WIN" || status === "GAME_OVER";

      if (action.payload == "left") {
        state.moves += "0";
      } else if (action.payload == "right") {
        state.moves += "1";
      } else if (action.payload == "up") {
        state.moves += "2";
      } else if (action.payload == "down") {
        state.moves += "3";
      }

      return {
        tiles,
        lastMove: action.payload,
        status: shouldChangeStatus ? status : state.status,
        randomSeed: tiles[tiles.length - 1].lastRandom,
        moves: state.moves,
      };
    }
    default: {
      throw new Error(`Unhandled action: ${action}`);
    }
  }
}

type gameProviderType = {
  isLoged: boolean;
};

const GameProvider = ({ isLoged }) => {
  const [state, dispatch] = useGameLocalStorage<GameState>(
    "game",
    initState(),
    gameReducer
  );

  const randomSeed = useReduxSelector(selectRandomSeed);
  const reduxDispatch = useReduxDispatch();
  const gameStage = useReduxSelector(selectGameStage);

  useEffect(() => {
    console.log(
      "Seeed Changed.................................",
      randomSeed,
      state
    );
    if (randomSeed && gameStage === GameStageEnum.INITIALIZING) {
      reduxDispatch(updateGameStage(GameStageEnum.PLAYING));
      reduxDispatch(changeNewGamePressed(false));
      reduxDispatch(changeUserPLayGame(true));
      reduxDispatch(changeSessionNFTMinted(false));
      dispatch({ type: "restart", payload: randomSeed });
    }
  }, [randomSeed]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      const direction: Direction | undefined =
        KEYBOARD_ARROW_TO_DIRECTION_MAP[e.key];
      if (direction) {
        if (isLoged == false) {
          router.push({
            pathname: "/login",
            query: { returnUrl: router.asPath },
          });
        } else {
          dispatch({ type: "move", payload: direction });
        }
      }
    };
    if (gameStage === GameStageEnum.PLAYING) {
      document.addEventListener("keydown", handleKeyPress);

      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [dispatch, gameStage]);
  return (
    <GameContext.Provider value={{ gameState: state, dispatch }}>
      <GameStats />
      <div>
        <BoardContainer />
      </div>
    </GameContext.Provider>
  );
};

export default GameProvider;
