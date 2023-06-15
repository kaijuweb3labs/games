import React from "react";
import { Tile } from "../../interfaces";
import Tiles from "../Tiles";
import styles from "./Board.module.scss";
import Lottie from "react-lottie";
import { useReduxSelector } from "@/redux/hooks";
import { selectNewGamePressed } from "@/redux/slices/user";
import loadingAnimationData from "./../../../assets/animations/loading.json";
import { GameStageEnum, selectGameStage } from "@/redux/slices/game";

const BoardGrid = () => {
  const grid = Array.from(Array(4).keys()).map((rowId) => {
    const columns = Array.from(Array(4).keys()).map((colId) => (
      <div
        key={colId}
        className={styles.cell}
      />
    ));
    return (
      <div key={rowId} className={styles.row}>
        {columns}
      </div>
    );
  });

  return <div className={styles.gridContainer}>{grid}</div>;
};

const Board = (props: { tiles: Tile[] }) => {
  const createGameButtonPress = useReduxSelector(selectNewGamePressed);
  const gameStage = useReduxSelector(selectGameStage);

  return (
    <div className="flex flex-col justify-center items-center">
      <div id="boardContainer" className={styles.boardContainer}>
        <BoardGrid />
        <Tiles tiles={props.tiles} />
        {gameStage !== GameStageEnum.PLAYING && (
          <div
            className="justify-center items-center 
            rounded-[30px] bg-black/70 inset-0 absolute z-10"
          >
            {" "}
            {createGameButtonPress && (
              <div className="h-full w-full flex flex-col justify-center items-center">
                <h1 className="flex font-bold text-white text-center lg:text-[20px]">
                  Game Initializing
                </h1>
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: loadingAnimationData,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  height={100}
                  width={100}
                  isStopped={false}
                  isPaused={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
