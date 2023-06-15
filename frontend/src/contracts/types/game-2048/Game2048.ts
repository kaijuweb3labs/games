/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface Game2048Interface extends utils.Interface {
  functions: {
    "gameIDtoMoves(string)": FunctionFragment;
    "verify2048(string,string,uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "gameIDtoMoves" | "verify2048"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "gameIDtoMoves",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "verify2048",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "gameIDtoMoves",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "verify2048", data: BytesLike): Result;

  events: {};
}

export interface Game2048 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: Game2048Interface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    gameIDtoMoves(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    verify2048(
      gameId: PromiseOrValue<string>,
      moves: PromiseOrValue<string>,
      FEScore: PromiseOrValue<BigNumberish>,
      randomNumber: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  gameIDtoMoves(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  verify2048(
    gameId: PromiseOrValue<string>,
    moves: PromiseOrValue<string>,
    FEScore: PromiseOrValue<BigNumberish>,
    randomNumber: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    gameIDtoMoves(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    verify2048(
      gameId: PromiseOrValue<string>,
      moves: PromiseOrValue<string>,
      FEScore: PromiseOrValue<BigNumberish>,
      randomNumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    gameIDtoMoves(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    verify2048(
      gameId: PromiseOrValue<string>,
      moves: PromiseOrValue<string>,
      FEScore: PromiseOrValue<BigNumberish>,
      randomNumber: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    gameIDtoMoves(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    verify2048(
      gameId: PromiseOrValue<string>,
      moves: PromiseOrValue<string>,
      FEScore: PromiseOrValue<BigNumberish>,
      randomNumber: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
