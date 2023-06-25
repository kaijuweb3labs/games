import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { setIsRewardModalOpen } from "@/redux/slices/modals";
import AnimatedModal from "@/components/molecules/AnimatedModal";

const RewardModal: React.FC = () => {
  const isOpen = useReduxSelector((state) => state.modals.isRewardModalVisible);
  const dispatch = useReduxDispatch();

  const closeModal = () => {
    dispatch(setIsRewardModalOpen(false));
  };

  return (
    <AnimatedModal show={isOpen} onClose={closeModal}>
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
          <img
            src="/starGradient.svg"
            alt="Star"
            className="h-[100px] w-[100px]"
          />
          <h3 className="w-[300px] text-[18px] font-bold text-white text-center mt-[24px]">
            Check your wallet balance your reward has been credited
          </h3>
          <button
            className="bg-[#C64CB8] w-[175px] py-[11px] text-[12px]
            text-white rounded-[14px] mt-[16px]"
            onClick={closeModal}
          >
            OK
          </button>
        </div>
      </div>
    </AnimatedModal>
  );
};

export default RewardModal;
