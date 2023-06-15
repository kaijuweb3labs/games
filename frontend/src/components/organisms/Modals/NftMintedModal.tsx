import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { setIsNftMintedModalOpen } from "@/redux/slices/modals";
import AnimatedModal from "@/components/molecules/AnimatedModal";

type NftMintProp = {
  playAgain: () => void;
  closeProp: () => void;
};

const NftMintedModal: React.FC<NftMintProp> = ({ playAgain, closeProp }) => {
  const isOpen = useReduxSelector((state) => state.modals.isNftMintedModalOpen);
  const dispatch = useReduxDispatch();

  const closeModal = () => {
    dispatch(setIsNftMintedModalOpen(false));
    closeProp();
  };

  return (
    <AnimatedModal show={true} onClose={() => {}}>
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
          <div
            className="flex flex-col justify-center items-center bg-[#F4BB76]
            rounded-[20px] p-[16px]"
          >
            <img src="/trophy.svg" alt="Trophy" className="h-[45px] w-[45px]" />
          </div>
          <h3 className="text-[18px] font-bold text-white mt-[24px]">
            New NFT minted
          </h3>
          <p className="w-[250px] text-[14px] text-white text-center mt-[6px]">
            New NFT minted for the highscore. Please check on Kaiju Wallet
          </p>
          <button
            className="bg-[#C64CB8] w-[175px] py-[11px] text-[12px]
            text-white rounded-[14px] mt-[16px]"
            onClick={playAgain}
          >
            Play again
          </button>
        </div>
      </div>
    </AnimatedModal>
  );
};

export default NftMintedModal;
