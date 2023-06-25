import { rewards } from "@/utils/constants/game";

const Reward: React.FC<{ rank: string | number }> = ({ rank }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center space-y-[6px] lg:space-x-[6px] lg:space-y-0">
      <div className="flex flex-row items-center space-x-[6px]">
        <div className="p-[6px] bg-[#676A8E] shadow-sm rounded-[10px]">
          <img src="/tether.svg" alt="tether" className="h-[16px] w-[16px]" />
        </div>
        <h3 className="text-[10px] font-medium text-white">
          {rewards[rank].usdt} USDT
        </h3>
      </div>
      <div className="hidden lg:inline-block text-white">+</div>
      <div className="flex flex-row items-center space-x-[6px]">
        <div className="p-[6px] bg-[#676A8E] shadow-sm rounded-[10px]">
          <img src="/logo.svg" alt="logo" className="h-[16px] w-[16px]" />
        </div>
        <h3 className="text-[10px] font-medium text-white">
          {rewards[rank].karc} KARC
        </h3>
      </div>
    </div>
  );
};

export default Reward;
