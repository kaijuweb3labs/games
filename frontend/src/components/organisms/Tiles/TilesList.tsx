import React, { useEffect, useState } from "react";
import {
  ScreenSizeBreakpoint,
  TilesScreenTransformFactor,
} from "../../../constants/constants";
import { Tile, TransformFactor } from "../../interfaces";
import { default as BoardTile } from "./Tile";

import styles from "./TilesList.module.scss";

const TilesList = (props: { tiles: Tile[]; factor: number }) => {
  return (
    <div>
      {props.tiles.map((x) => (
        <BoardTile
          key={x.id}
          value={x.value}
          type={x.type}
          x={x.positionY * props.factor}
          y={x.positionX * props.factor}
        />
      ))}
    </div>
  );
};

export const TileContainer = (props: { tiles: Tile[] }) => {
  const [factor, setFactor] = useState<TransformFactor>(calcFactor());

  useEffect(() => {
    const handleResize = () => {
      setFactor(calcFactor());
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sortedTiles = props.tiles.sort((t1, t2) => t1.id - t2.id);
  return (
    <div className={styles.tileContainer}>
      <TilesList tiles={sortedTiles} factor={factor} />
    </div>
  );
};

const calcFactor = () => {
  if (typeof window !== "undefined") {
    if (window.innerWidth <= ScreenSizeBreakpoint.S) {
      return TilesScreenTransformFactor.XS;
    }
    if (window.innerWidth <= ScreenSizeBreakpoint.M) {
      return TilesScreenTransformFactor.M;
    }
    if (ScreenSizeBreakpoint.M <= window.innerWidth) {
      return TilesScreenTransformFactor.LG;
    }
  }

  return TilesScreenTransformFactor.S;
};
