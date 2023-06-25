import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type iInitialState = {
  isSideBarOpen: boolean;
  isNftMintedModalOpen: boolean;
  isMintNftModalVisible: boolean;
  isRewardModalVisible: boolean;
  isBalancesModalVisible: boolean;
  isQrModalVisible: boolean;
  isComingSoonModalVisible: boolean;
  selectedApp: 'ios' | 'android';
};

export const initialState: iInitialState = {
  isSideBarOpen: false,
  isNftMintedModalOpen: false,
  isMintNftModalVisible: false,
  isRewardModalVisible: false,
  isBalancesModalVisible: false,
  isQrModalVisible: false,
  isComingSoonModalVisible: false,
  selectedApp: 'android',
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setIsSideBarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSideBarOpen = action.payload;
    },
    setIsNftMintedModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isNftMintedModalOpen = action.payload;
    },
    setIsMintNftModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isMintNftModalVisible = action.payload;
    },
    setIsRewardModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isRewardModalVisible = action.payload;
    },
    setIsBalancesModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isBalancesModalVisible = action.payload;
    },
    setIsQrModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isQrModalVisible = action.payload;
    },
    setIsComingSoonModlOpen: (state, action: PayloadAction<boolean>) => {
      state.isComingSoonModalVisible = action.payload;
    },
    setQrModal: (state, action: PayloadAction<{appType: 'ios' | 'android', isOpen: boolean}>) => {
      state.selectedApp = action.payload.appType;
      state.isQrModalVisible = action.payload.isOpen;
    }
  },
});

export const {
  setIsSideBarOpen,
  setIsNftMintedModalOpen,
  setIsMintNftModalOpen,
  setIsRewardModalOpen,
  setIsBalancesModalOpen,
  setIsQrModalOpen,
  setIsComingSoonModlOpen,
  setQrModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
