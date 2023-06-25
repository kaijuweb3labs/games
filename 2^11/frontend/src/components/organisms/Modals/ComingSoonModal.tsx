import AnimatedModal from "@/components/molecules/AnimatedModal"
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { setIsComingSoonModlOpen } from "@/redux/slices/modals";

export const ComingSoonModal: React.FC = () => {
  const isOpen = useReduxSelector(state => state.modals.isComingSoonModalVisible);
  const dispatch = useReduxDispatch();

  const closeModal = () => {
    dispatch(setIsComingSoonModlOpen(false));
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
          <h3 className="w-[300px] text-[24px] font-bold text-white text-center mt-[24px]">
            Coming soon!
          </h3>
          <button
            className="bg-[#C64CB8] w-[175px] py-[11px] text-[12px]
            text-white rounded-[14px] mt-[24px] outline-0 ring-0"
            onClick={closeModal}
          >
            OK
          </button>
        </div>
      </div>
    </AnimatedModal>
  );
};
