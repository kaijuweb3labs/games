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
  changeNFTMinting,
  selectNftMinting,
  selectsessionNFTMinted,
  selectUser,
  UserState,
  changeSessionNFTMinted,
} from "@/redux/slices/user";
import { useSelector } from "react-redux";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import Lottie from "react-lottie";
import loadingAnimationData from "../../assets/animations/loading.json";
import { fetchBalances, selectWalletState } from "@/redux/slices/wallet";
import { GameStageEnum, updateGameStage } from "@/redux/slices/game";
import QRCodeModel from "@/components/organisms/Modals/QRCodeModal";
import BalancesModal from "@/components/organisms/Modals/BalancesModal";
import NewGameButton from "@/components/organisms/NewGameButton";

const index: React.FC = () => {
  const userState: UserState = useSelector(selectUser);
  const isNFTMinting = useSelector(selectNftMinting);
  const isNFTMinted = useSelector(selectsessionNFTMinted);
  const [isLoged, setIsLoged] = useState(userState.uid ? true : false);
  const reduxDispatch = useReduxDispatch();
  const wallet = useReduxSelector(selectWalletState);
  console.log("Wallet...........................", wallet);
  useEffect(() => {
    reduxDispatch(fetchBalances());
  }, [wallet.account.address]);

  const playAgain = () => {
    console.log("New Game..............");
    reduxDispatch(changeNewGamePressed(true));
    console.log("Dispatch New Game................");
    reduxDispatch(updateGameStage(GameStageEnum.INITIALIZING));
    reduxDispatch(changeNFTMinting(false));
    reduxDispatch(changeSessionNFTMinted(false));
  };

  const closePop = () => {
    console.log("Dont mint and Return to New Game.");
    reduxDispatch(updateGameStage(GameStageEnum.PENDING));
    reduxDispatch(changeNFTMinting(false));
    reduxDispatch(changeSessionNFTMinted(true));
  };

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
              <Medalists />
              <Leaderboard />
              <button
                className="lg:hidden bg-[#C64CB8] py-[14px] text-[16px] my-[20px]
                text-white font-bold rounded-[14px] lg:hover:scale-110 transition duration-300"
              >
                Become a sponsor
              </button>
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
        </div>
      }
      {isNFTMinting && (
        <div
          className="justify-center items-center 
    rounded-[30px] bg-black/80 w-full h-full bottom-0 left-0 absolute z-20"
        >
          {!isNFTMinted && (
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
          {isNFTMinted && (
            <div>
              {/* <h1 className="flex font-extrabold justify-center text-3xl text-white place-content-center pt-[300px]">
                NFT is successfully Minted
              </h1>
              <div className="flex items-center justify-center pt-[20px]">
                <div
                  className="bg-[#a11bc2] w-[300px]
        py-[14px] px-[30px] cursor-pointer rounded-[14px] hover:scale-110 transition duration-300"
                  onClick={() => {
                    reduxDispatch(changeNFTMinting(false));
                    reduxDispatch(fetchLeaderBoard());
                  }}
                >
                  <h1 className="text-center text-[13px] font-medium text-xl text-[#ffffff] ml-[8px]">
                    Ok
                  </h1>
                </div>
              </div> */}
              <NftMintedModal playAgain={playAgain} closeProp={closePop} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default index;
