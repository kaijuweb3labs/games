import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import {
  UserState,
  selectUser,
  selectUserDetails,
  signOutUser,
} from "@/redux/slices/user";
import { Tooltip } from "@mui/material";
import React, { useCallback, useState } from "react";
import { selectAccountAddress } from "@/redux/slices/wallet";

function ProfileCard() {
  const userData: UserState = useReduxSelector(selectUser);
  const userAddress = useReduxSelector(selectAccountAddress);
  const userApiDetails = useReduxSelector(selectUserDetails);
  const reduxDispatch = useReduxDispatch();
  const [toolTipText, settoolTipText] = useState("Copy");

  const handleClick = useCallback(() => {
    reduxDispatch(signOutUser());
  }, [reduxDispatch]);

  if (!userData) {
    return;
  }
  return (
    <div>
      <div className="flex flex-row items-center ml-[16px] px-[8px] py-[4px] rounded-[14px] ">
        <button
          onClick={handleClick}
          className="group/profile rounded-full p-1 hover:bg-[#1C1D29] transiotion duration-300"
        >
          <div className="flex h-[38px] w-[38px] rounded-full border-2 border-[#1C1D29] absolute z-10 items-center justify-center bg-[#1c1d298a] opacity-0 group-hover/profile:opacity-100 transition duration-600">
            <img
              src="/assets/icons/logout-icon.svg"
              alt="Profile"
              className="h-[30px] w-[30px] rounded-full"
            />
          </div>

          <img
            src={
              userApiDetails && userApiDetails.userProfileImage !== '' && userApiDetails.userProfileImage !== undefined
                ? userApiDetails.userProfileImage
                : userData.picture !== '' && userData.picture !== undefined
                ? userData.picture
                : '/profilePlaceholder.svg'
            }
            alt="Profile"
            className="h-[38px] w-[38px] rounded-full"
          />
        </button>

        <div className="flex flex-col ml-[12px]">
          <h1 className="text-[16px] font-bold text-white line-clamp-1">
            {userApiDetails ? userApiDetails.name : userData.displayName}
          </h1>
          <Tooltip title={toolTipText} arrow>
            <h1
              onClick={(event) => {
                navigator.clipboard.writeText(userAddress);
                settoolTipText("Copied");
                setTimeout(() => {
                  settoolTipText("Copy");
                }, 3000);
              }}
              className="text-[12px] font-bold rounded text-[#C64CB8] hover:bg-[#2F3146] cursor-pointer transition duration-300"
            >
              {userAddress &&
                `${userAddress.slice(0, 10)}...${userAddress.slice(35)}`}
            </h1>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
