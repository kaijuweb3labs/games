import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { setIsQrModalOpen } from "@/redux/slices/modals";
import AnimatedModal from "@/components/molecules/AnimatedModal";
import QRCode from "qrcode.react";
import { useState } from "react";
import TextAtom from "@/components/atoms/TextAtom";

const QRCodeModel: React.FC = () => {
  const { isQrModalVisible, selectedApp } = useReduxSelector((state) => state.modals);
  const dispatch = useReduxDispatch();

  const [uri] = useState(
    selectedApp === 'ios'
      ? process.env.NEXT_PUBLIC_IOS_APP_URI
      : process.env.NEXT_PUBLIC_ANDROID_APP_URI
  );
  const closeModal = () => {
    dispatch(setIsQrModalOpen(false));
  };

  return (
    <AnimatedModal show={isQrModalVisible} onClose={closeModal}>
      <div className="flex flex-col justify-center items-center">
        <div className='w-full my-[8px] flex flex-row'>
          <div
            className="p-2 rounded-full hover:bg-[#424563] ml-auto "
            onClick={closeModal}
          >
            <img src="/close.svg" alt="Close" className="h-[14px] w-[14px]" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center p-[20px]">
          <TextAtom fontFamily="Exo 2" className="text-[18px] font-bold mt-[20px]">
            Download Kaiju Wallet on Mobile
          </TextAtom>
          <TextAtom className=" text-[14px] text-black text-center mb-2">
            Use the same login that you used for the game to access Funds NFTs
            with Kaiju Wallet App.
          </TextAtom>
          <div className="p-3 bg-white opacity-99">
            <QRCode value={uri} size={250} />
          </div>
        </div>
      </div>
    </AnimatedModal>
  );
};

export default QRCodeModel;
