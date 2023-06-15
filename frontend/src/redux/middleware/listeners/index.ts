import { createListenerMiddleware } from "@reduxjs/toolkit";
import updateAddressEffect from "./updateAddressEffect";
import { setAccountAddress } from "@/redux/slices/wallet";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: setAccountAddress,
  effect: updateAddressEffect,
});
