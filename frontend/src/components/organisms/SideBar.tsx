import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { setIsBalancesModalOpen, setIsSideBarOpen } from "@/redux/slices/modals";
import { useRouter } from "next/router";
import { NetworkBaseAsset } from "@/types/network";
import { selectAccountBalances, selectPrimaryAsset } from "@/redux/slices/wallet";

const SideBar: React.FC = () => {
  const router = useRouter();
  const dispatch = useReduxDispatch();
  
  const isOpen = useReduxSelector((state) => state.modals.isSideBarOpen);
  const primaryAsset: NetworkBaseAsset = useReduxSelector(selectPrimaryAsset);
  const balances = useReduxSelector(selectAccountBalances);

  const usdtBallance = () => {
    if(!balances[primaryAsset.id]?.assetAmount.coin){
      return undefined
    } else {
      return parseFloat(balances[primaryAsset.id]?.assetAmount.coin).toFixed(1)
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => dispatch(setIsSideBarOpen(false))}
        className="relative z-50"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="fixed inset-0 flex items-center justify-center md:p-4">
            <Dialog.Panel
              className="h-full w-full md:max-w-xs mr-auto md:rounded-[20px] bg-[#13141C]
              md:bg-[#1C1D29] p-[24px] md:p-[18px]"
            >
              <div
                className="flex flex-row items-center"
                onClick={() => dispatch(setIsSideBarOpen(false))}
              >
                <div className="p-2 rounded-full hover:bg-[#2F3146] transiotion duration-300">
                  <img
                    src="/close.svg"
                    alt="Close"
                    className="h-[14px] w-[14px]"
                  />
                </div>
                <img
                  src="/logo.svg"
                  alt="Logo"
                  className="h-[35px] w-[35px] ml-[29px]"
                />
                <h1 className="text-[14px] font-bold text-white ml-[12px]">
                  Kaiju Games
                </h1>
              </div>
              <button
                onClick={() => dispatch(setIsBalancesModalOpen(true))}
                className="md:hidden flex flex-row items-center bg-[#1C1D29] h-[42px] w-[130px]
                justify-center rounded-[14px] hover:scale-110 transition duration-300 mt-[40px]"
              >
                <img src="/wallet.svg" alt="Wallet" className="h-[15px] w-[15px]" />
                <h1 className="text-[16px] font-medium text-white ml-[8px]">
                  {usdtBallance() || "0"}{" "}
                  {primaryAsset.symbol}
                </h1>
                <img
                  src="/chevronDown.svg"
                  alt="Arrow"
                  className="h-[10px] w-[10px] ml-[8px]"
                />
              </button>
              <h1 className="text-[20px] md:text-[16px] font-bold text-white mt-[24px]">
                Games
              </h1>
              <div className="flex flex-col space-y-[20px] mt-[20px]">
                <div
                  className="flex flex-row space-x-[8px] sidebar-item"
                  style={
                    router.pathname.includes("2048")
                      ? {
                          backgroundColor: "#C64CB8",
                        }
                      : null
                  }
                >
                  <img
                    src="/2048.svg"
                    alt="2048"
                    className={`${
                      router.pathname.includes("2048") && "filter invert"
                    } h-[20px] w-[20px]`}
                  />
                  <h3 className="text-[16px] md:text-[14px] text-white">2048</h3>
                </div>
                <div className="flex flex-row space-x-[8px] sidebar-item">
                  <img
                    src="/3InaRow.svg"
                    alt="3 In a Row"
                    className="h-[20px] w-[20px]"
                  />
                  <h3 className="text-[16px] md:text-[14px] text-white">3 in a Row</h3>
                </div>
                <div className="flex flex-row space-x-[8px] sidebar-item">
                  <img
                    src="/tic-tac-toe.svg"
                    alt="Tic Tac Toe"
                    className="h-[20px] w-[20px]"
                  />
                  <h3 className="text-[16px] md:text-[14px] text-white">Tic-Tac-Toe</h3>
                </div>
                <p className="text-[16px] md:text-[14px] text-[#C64CB8] px-[8px]">
                  All Games
                </p>
              </div>
              <h3 className="text-[16px] md:text-[14px] text-white mt-[40px] sidebar-item">
                My rewards
              </h3>
              <h3 className="text-[16px] md:text-[14px] text-white mt-[20px] sidebar-item">
                Store
              </h3>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default SideBar;
