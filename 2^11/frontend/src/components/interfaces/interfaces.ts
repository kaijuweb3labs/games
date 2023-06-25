import { Dispatch } from "react";

export type Value = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048;

export type TransformFactor = 176 | 123 | 97 | 73;

export type Direction = "right" | "left" | "up" | "down";

export type TileType = "merged" | "new";

export interface Tile {
  id: number;
  value: Value;
  type: TileType;
  positionX: number;
  positionY: number;
  lastRandom: number;
}

export type GameContextActionType =
  | { type: "restart" }
  | { type: "continue" }
  | { type: "move"; payload: Direction }
  | { type: "initGame" };

export type GameStatus =
  | "WIN"
  | "GAME_OVER"
  | "IN_PROGRESS"
  | "PLAY_AFTER_WIN"
  | "INITIALIZED"
  | "ACHIEVED_2048";

export interface GameState {
  tiles: Tile[];
  lastMove: Direction;
  status: GameStatus;
  randomSeed: any;
  moves: number[];
  gameInitCalled: boolean;
}

export interface IGameContext {
  gameState: GameState;
  dispatch: Dispatch<GameContextActionType>;
}
