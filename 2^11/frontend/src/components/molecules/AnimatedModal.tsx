import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

type AnimatedModalProps = {
  show: boolean;
  onClose: () => void;
  children: JSX.Element;
};

const AnimatedModal: React.FC<AnimatedModalProps> = ({
  show,
  onClose,
  children,
}) => {
  return (
    <Transition show={show} as={Fragment}>
      <Dialog open={show} onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed bottom-0 md:inset-0 flex items-center justify-center md:p-4 w-full">
            <Dialog.Panel
              className="w-full md:max-w-md mx-auto rounded-t-[30px] md:rounded-[30px] bg-[#1C1D29] p-[10px] relative"
            >
              {children}
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default AnimatedModal;
