import { AAAccountAddress, EOAAccountAddress } from "@/types/wallet";
import {
  AnyAction,
  ListenerEffectAPI,
  PayloadAction,
  ThunkDispatch,
  current,
} from "@reduxjs/toolkit";
import { selectAccountAddress } from "@/redux/slices/wallet";

import {
  changeNewGamePressed,
  selectAuthHeaders,
  selectNewGamePressed,
  selectUser,
  setUserDetails,
} from "@/redux/slices/user";
import UserAPI from "@/services/user-api";
import { createGameSessionThunk } from "@/redux/slices/game";

const updateAddressEffect = async (
  action: PayloadAction<{
    eoaAddress: EOAAccountAddress;
    aaAddress: AAAccountAddress;
  }>,
  listenerApi: ListenerEffectAPI<
    unknown,
    ThunkDispatch<unknown, unknown, AnyAction>,
    unknown
  >
) => {
  const state: any = listenerApi.getState();
  const headers = await selectAuthHeaders(state);
  //   console.log(state.wallet);
  if (state.wallet) {
    const address = selectAccountAddress(state);
    let userDetails = await UserAPI.getUserDetailsByAddress(address, headers);
    if (userDetails) {
      listenerApi.dispatch(setUserDetails(userDetails));
    } else {
      const userState = selectUser(state);
      userDetails = await UserAPI.addUserDetails({
          publicKeys: [
            {
              evm: address,
            },
          ],
          email: userState.email,
          name: userState.displayName,
          userProfileImage: userState.picture,
          username:"",
          ens:"",
          bio:"",
          website: {
            title:"",
            value:""
          },
          instagram: {
            title:"",
            value:""
          },
          twitter: {
            title:"",
            value:""
          },
          discord: {
            title:"",
            value:""
          },
          youtube: {
            title:"",
            value:""
          },
          linkedin: {
            title:"",
            value:""
          },
          userLevel: "",
          publicNFTProfile: true,
          analytics: false,
          currency: "USD"
        },
        headers
      );
      listenerApi.dispatch(setUserDetails(userDetails));
    }

    const user = selectUser(state);
    const isNewGame = selectNewGamePressed(state);
    if (user.uid && isNewGame) {
      listenerApi.dispatch(createGameSessionThunk());
      listenerApi.dispatch(changeNewGamePressed(false));
    }
  }
};

export default updateAddressEffect;
