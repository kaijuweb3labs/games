import React, { useEffect } from "react";
// import { useGameContext } from "../Game";
import { useGameContext } from "../../../hooks/useGameContext";
import { BoardProvider } from "./BoardProvider";
import { useReduxSelector } from "@/redux/hooks";
import { GameStageEnum, selectGameStage } from "@/redux/slices/game";

let startClientX: number | null = null;
let startClientY: number | null = null;

export const BoardContainer = () => {
  const { dispatch } = useGameContext();
  const gameStage = useReduxSelector(selectGameStage);

  useEffect(() => {
    const handleTouchStart = (event: { touches: string | any[] }) => {
      if (event.touches.length === 1 && gameStage === GameStageEnum.PLAYING) {
        const startTouch = event.touches[0];
        startClientX = startTouch.clientX;
        startClientY = startTouch.clientY;
      }
    };

    const handleTouchEnd = (event: {
      touches: string | any[];
      changedTouches: any[];
    }) => {
      if (
        !startClientX ||
        !startClientY ||
        event.touches.length > 0 ||
        gameStage !== GameStageEnum.PLAYING
      ) {
        return;
      }

      const endTouch = event.changedTouches[0];
      var endClientX = endTouch.clientX;
      var endClientY = endTouch.clientY;

      var xDiff = startClientX - endClientX;
      var yDiff = startClientY - endClientY;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff < 0) {
          /* right swipe */
          dispatch({ type: "move", payload: "right" });
        } else {
          /* left swipe */
          dispatch({ type: "move", payload: "left" });
        }
      } else {
        if (yDiff < 0) {
          /* down swipe */
          dispatch({ type: "move", payload: "down" });
        } else {
          /* up swipe */
          dispatch({ type: "move", payload: "up" });
        }
      }
      /* reset values */
      startClientX = null;
      startClientY = null;
    };

    const boardContainer = document.getElementById("boardContainer");
    if (gameStage === GameStageEnum.PLAYING) {
      boardContainer?.addEventListener("touchstart", handleTouchStart as any);
      boardContainer?.addEventListener("touchend", handleTouchEnd as any);
      boardContainer.style.touchAction = "none";
    } else {
      boardContainer.style.touchAction = "auto";
    }

    return () => {
      boardContainer?.removeEventListener(
        "touchstart",
        handleTouchStart as any
      );
      boardContainer?.removeEventListener("touchend", handleTouchEnd as any);
    };
  }, [dispatch, gameStage]);

  return <BoardProvider />;
};
