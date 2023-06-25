import Apps from "@/components/organisms/Apps";
import GameHints from "@/components/organisms/GameHints";
import Header from "@/components/organisms/Header";
import Leaderboard from "@/components/organisms/Leaderboard/Leaderboard";
import Medalists from "@/components/organisms/Medalists/Medalists";
import NftMintedModal from "@/components/organisms/Modals/NftMintedModal";
import RewardModal from "@/components/organisms/Modals/RewardModal";
import SideBar from "@/components/organisms/SideBar";
import Sponsor from "@/components/organisms/Sponsor";
import React, { useEffect, useState } from "react";
import GameProvider from "@/components/organisms/GameProvider";
import {
  changeNewGamePressed,
  selectUser,
  UserState,
} from "@/redux/slices/user";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import Lottie from "react-lottie";
import loadingAnimationData from "../../assets/animations/loading.json";
import { fetchBalances, selectWalletState } from "@/redux/slices/wallet";
import {
  GameStageEnum,
  createGameSessionThunk,
  selectGameStage,
  updateGameStage,
} from "@/redux/slices/game";
import QRCodeModel from "@/components/organisms/Modals/QRCodeModal";
import BalancesModal from "@/components/organisms/Modals/BalancesModal";
import NewGameButton from "@/components/organisms/NewGameButton";
import useGameRefresh from "@/hooks/useGameRefresh";
import { ComingSoonModal } from "@/components/organisms/Modals/ComingSoonModal";
import { LeaderboardTimer } from "@/components/organisms/Leaderboard/LeaderboardTimer";

const Index: React.FC = () => {
  const userState: UserState = useReduxSelector(selectUser);
  const gameStage = useReduxSelector(selectGameStage);
  const [isLoged, setIsLoged] = useState(userState.uid ? true : false);
  const reduxDispatch = useReduxDispatch();
  const wallet = useReduxSelector(selectWalletState);
  // console.log("Wallet...........................", wallet);
  useEffect(() => {
    reduxDispatch(fetchBalances());
  }, [reduxDispatch, wallet.account.address]);

  const playAgain = () => {
    reduxDispatch(changeNewGamePressed(true));
    // console.log("Dispatching New Game.");
    reduxDispatch(updateGameStage(GameStageEnum.INITIALIZING));
    reduxDispatch(createGameSessionThunk());
  };

  const closePop = () => {
    console.log("Close NftMintedModal");
    reduxDispatch(updateGameStage(GameStageEnum.PENDING));
  };

  useGameRefresh();
  return (
    <div>
      {
        <div className="h-screen w-screen flex-1 flex flex-col px-[14px] py-[12px] lg:px-[28px] lg:py-[25px]">
          <Header isLoged={isLoged} />
          <div className="h-full w-full flex flex-col lg:flex-row space-x-[36px] mt-[25px]">
            <div className="flex flex-6 flex-col">
              <div className="w-full flex flex-col lg:flex-row lg:space-x-[24px]">
                <Sponsor />
                <div className="hidden lg:inline-block flex-2">
                  <Apps />
                </div>
              </div>
              <div className="lg:hidden mt-[16px] ml-0 flex flex-col space-y-[12px]">
                <NewGameButton />
                <GameProvider isLoged={isLoged} />
                <GameHints />
              </div>
              <div className="lg:hidden">
                <Apps />
              </div>
              <LeaderboardTimer />
              <Medalists />
              <Leaderboard />
            </div>
            <div className="hidden lg:inline-flex flex-5 flex-col space-y-[12px]">
              <GameProvider isLoged={isLoged} />
              <GameHints />
            </div>
          </div>
          <SideBar />
          {/* <MintNftModal /> */}
          <RewardModal />
          <QRCodeModel />
          <BalancesModal />
          <ComingSoonModal />
        </div>
      }
      {(gameStage === GameStageEnum.MINTING ||
        gameStage === GameStageEnum.MINTED) && (
        <div
          className="justify-center items-center 
    rounded-[30px] bg-black/80 w-full h-full bottom-0 left-0 absolute z-20"
        >
          {gameStage === GameStageEnum.MINTING && (
            <div className="z-50">
              <h1 className="flex font-extrabold justify-center text-3xl text-white place-content-center pt-[300px] z-50">
                NFT is Minting
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
                height={200}
                width={200}
                isStopped={false}
                isPaused={false}
              />
            </div>
          )}
          {gameStage === GameStageEnum.MINTED && (
            <div>
              <NftMintedModal playAgain={playAgain} closeProp={closePop} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
