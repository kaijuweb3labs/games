import React, { memo } from "react";
import { TileType, Value } from "../../interfaces";

import styles from "./Tile.module.scss";

interface TileProps {
  value: Value;
  type: TileType;
  x: number;
  y: number;
  small?: boolean;
  customVal?: number;
  onClick?: any;
}

const Tile = memo((props: TileProps) => {
  return (
    <div
      className={`${styles.tile} ${styles[`tile-${props.value}`]} ${
        props.small && styles["small-tile"]
      }`}
      style={{
        transform: `translate(${props.x}px, ${props.y}px)`,
        // width: props.width,
        // height: props.height,
      }}
      onClick={props.onClick}
    >
      <div
        className={`${styles.tileInner} ${props.type} ${
          props.small && styles["smallTileInner"]
        }`}
        // onClick={() => {
        //   console.log("Clicke");
        // }}
      >
        {props.customVal || props.value}
      </div>
    </div>
  );
});

export default Tile;
