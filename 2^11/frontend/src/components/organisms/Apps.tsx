import { useReduxDispatch } from "@/redux/hooks";
import { setQrModal } from "@/redux/slices/modals";

const Apps: React.FC = () => {
  const dispatch = useReduxDispatch();
  
  return (
    <div className="flex-col items-center relative mt-[24px] lg:mt-0">
      <h3 className="text-[14px] font-bold text-[#C64CB8] text-center lg:text-left">
        Download Kaiju Wallet
      </h3>
      <div className="flex flex-row lg:flex-col items-center justify-center space-x-[9px] lg:space-y-[8px] lg:space-x-0 mt-[12px]">
        <a target="_blank" className="lg:hidden" href={process.env.NEXT_PUBLIC_ANDROID_APP_URI}>
          <div className="app-button">
            <img src="/googlePlay.svg" alt="Google Play" className="app-image" />
          </div>
        </a>
        <a target="_blank" className="lg:hidden" href={process.env.NEXT_PUBLIC_IOS_APP_URI}>
          <div className="app-button">
            <img src="/appStore.svg" alt="App Store" className="app-image" />
          </div>
        </a>
        <div
          className="hidden lg:inline-block app-button"
          onClick={() => {
            dispatch(setQrModal({ isOpen: true, appType: "android" }));
          }}
        >
          <img src="/googlePlay.svg" alt="Google Play" className="app-image" />
        </div>
        <div
          className="hidden lg:inline-block app-button"
          onClick={() => {
            dispatch(setQrModal({ isOpen: true, appType: "ios" }));
          }}
        >
          <img src="/appStore.svg" alt="App Store" className="app-image" />
        </div>
      </div>
    </div>
  );
};

export default Apps;
