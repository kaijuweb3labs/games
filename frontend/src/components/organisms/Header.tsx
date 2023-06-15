import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { setIsSideBarOpen } from "@/redux/slices/modals";
import router from "next/router";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  changeNewGamePressed,
  selectNewGamePressed,
  selectUser,
} from "@/redux/slices/user";
import Popover from "@mui/material/Popover";
import TokenBalances from "./Popup/TokenBalances";
import React from "react";
import {
  selectAccountBalances,
  selectPrimaryAsset,
} from "@/redux/slices/wallet";
import { NetworkBaseAsset } from "@/types/network";
import ProfileCard from "../molecules/ProfileCard";
import {
  GameStageEnum,
  createGameSessionThunk,
  selectGameStage,
  updateGameStage,
} from "@/redux/slices/game";

type HeaderProp = {
  isLoged?: boolean;
};

const Header: React.FC<HeaderProp> = ({ isLoged = true }) => {
  const user = useSelector(selectUser);
  const reduxDispatch = useReduxDispatch();
  const createGameButtonPress = useSelector(selectNewGamePressed);
  const dispatch = useReduxDispatch();
  const primaryAsset: NetworkBaseAsset = useReduxSelector(selectPrimaryAsset);
  const balances = useReduxSelector(selectAccountBalances);
  const [pingNewgameBtn, setpingNewgameBtn] = useState(false);
  const gameStage = useReduxSelector(selectGameStage);
  
  const onMenuClick = () => {
    dispatch(setIsSideBarOpen(true));
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // useEffect(() => {
  //   if (createGameButtonPress && user.uid) {
  //     console.log("-----------------Create Game Effect--------------");
  //     reduxDispatch(createGameSessionThunk());
  //   }
  // }, [reduxDispatch, user.uid, createGameButtonPress]);

  useEffect(() => {
    if (gameStage === GameStageEnum.PENDING) {
      let triggered = false;
      const onKeyPress = (e: KeyboardEvent) => {
        if (!triggered) {
          triggered = true;
          setpingNewgameBtn(true);
          setTimeout(() => {
            setpingNewgameBtn(false);
            triggered = false;
          }, 800);
        }
      };
      document.addEventListener("keydown", onKeyPress);

      return () => {
        document.removeEventListener("keydown", onKeyPress);
      };
    }
  }, [gameStage]);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const usdtBallance = () => {
    if (!balances[primaryAsset.id]?.assetAmount.coin) {
      return undefined;
    } else {
      return parseFloat(balances[primaryAsset.id]?.assetAmount.coin).toFixed(1);
    }
  };

  return (
    <div className="w-full flex flex-row items-center">
      <div
        className="hover:bg-[#2F3146] p-2 rounded-full transiotion duration-300"
        onClick={onMenuClick}
      >
        <img src="/menu.svg" alt="menu" className="h-[24px] w-[24px]" />
      </div>
      <div className="hidden md:flex flex-row items-center ml-[24px]">
        <img src="/logo.svg" alt="menu" className="h-[36px] w-[36px]" />
        <h1 className="text-[14px] font-bold text-white ml-[12px]">
          Kaiju Games
        </h1>
      </div>
      <div className={`flex flex-row ml-auto`}>
        <button
          disabled={
            gameStage === GameStageEnum.INITIALIZING ||
            gameStage === GameStageEnum.MINTING
          }
          className="hidden md:inline-block items-center bg-[#a11bc2] 
          h-[42px] w-[130px] cursor-pointer rounded-[14px] hover:scale-110 transition duration-300 disabled:opacity-25"
          onClick={() => {
            reduxDispatch(updateGameStage(GameStageEnum.INITIALIZING));

            if (!isLoged) {
              reduxDispatch(changeNewGamePressed(true));
              router.push({
                pathname: "/login",
                query: { returnUrl: router.asPath },
              });
            } else {
              reduxDispatch(createGameSessionThunk());
            }
          }}
        >
          <h1 className="text-[13px]  font-medium text-[#ffffff] ml-[8px]">
            New Game
          </h1>
        </button>
        <div
          aria-selected={pingNewgameBtn}
          className={`hidden md:inline-block h-[42px] w-[120px] bg-[#a11bc2] rounded-[14px] absolute -z-10 aria-selected:animate-ping`}
        ></div>
      </div>

      <button
        onClick={handleClick}
        className="hidden md:flex flex-row items-center ml-[16px] bg-[#1C1D29]
        h-[42px] w-[130px] justify-center rounded-[14px] hover:scale-110 transition duration-300"
      >
        <img src="/wallet.svg" alt="Wallet" className="h-[15px] w-[15px]" />
        <h1 className="text-[12px] font-medium text-white ml-[8px]">
          {usdtBallance() || "0"} {primaryAsset.symbol}
        </h1>
        <img
          src="/chevronDown.svg"
          alt="Arrow"
          className="h-[10px] w-[10px] ml-[8px]"
        />
      </button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { borderRadius: 5, backgroundColor: "#1C1D29" } }}
      >
        <TokenBalances />
      </Popover>

      {isLoged && (
        <>
          <ProfileCard />
        </>
      )}
      {!isLoged && (
        <>
          <div
            onClick={async () => {
              router.push({
                pathname: "/login",
                query: { returnUrl: router.asPath },
              });
            }}
            className="flex flex-row items-center ml-[16px] bg-[#851f79] cursor-pointer
            h-[42px] w-[130px] justify-center rounded-[14px] hover:scale-110 transition duration-300"
          >
            <img src="/login.svg" alt="Login" className="h-[15px] w-[15px]" />
            <h1 className="text-[13px] font-medium text-white ml-[8px] text-center">
              Login
            </h1>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
