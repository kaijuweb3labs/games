import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import {
  GameStageEnum,
  selectGameStage,
  updateGameStage,
} from "@/redux/slices/game";
import { changeNewGamePressed } from "@/redux/slices/user";
import { useEffect } from "react";
import { GAME_ID } from "./useLocalStorage";

const useGameRefresh = (onGameReset?: () => void) => {
  const gameStage = useReduxSelector(selectGameStage);
  const reduxDispatch = useReduxDispatch();
  const initialGameCheck = () => {
    const leavedAt = window.localStorage.getItem("leavedAt");
    if (leavedAt) {
      console.log("Reset game to pending...");
      reduxDispatch(changeNewGamePressed(false));
      reduxDispatch(updateGameStage(GameStageEnum.PENDING));
      window?.localStorage.removeItem(GAME_ID);
      window.localStorage.removeItem("leavedAt");
      onGameReset && onGameReset();
      let ev2 = new CustomEvent("RESET_GAME", {
        detail: "Page refresh",
      });
      window.dispatchEvent(ev2);
    }
  };
  useEffect(() => {
    const onLeave = (event) => {
      window.localStorage.setItem("leavedAt", "MINT_NEW_GAME");
    };
    const beforeLeave = function (event) {
      // Cancel the event (modern browsers will ignore this, but it's required for older browsers)
      event.preventDefault();
    };

    if (
      gameStage === GameStageEnum.INITIALIZING ||
      gameStage === GameStageEnum.MINTING
    ) {
      window.addEventListener("beforeunload", beforeLeave);
      // Event handler for unload event
      window.addEventListener("unload", onLeave);
    }

    return () => {
      window.removeEventListener("unload", onLeave);
      window.removeEventListener("beforeunload", beforeLeave);
    };
  }, [gameStage]);
  useEffect(() => {
    initialGameCheck();
  });
};

export default useGameRefresh;
