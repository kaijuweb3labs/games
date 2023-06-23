const Sponsor: React.FC = () => {
  return (
    <div className="flex flex-6 flex-col py-[10px] px-[15px] md:p-[20px] bg-[#B40EC6] rounded-[20px] lg:rounded-[30px] relative">
      <div className="hidden md:inline-block p-[15px] bg-[#B40EC6] border-4 border-[#13141C] rounded-[22px] absolute -top-[20px]">
        <img src="/logo.svg" alt="logo" className="h-[50px] w-[50px]" />
      </div>
      <div className="flex-1 flex-col md:space-y-[8px]">
        <div className="hidden md:inline-flex flex-col ml-[101px]">
          <h1 className="text-[16px] md:text-[18px] font-bold text-white">
            Kaiju Labs
          </h1>
          <h2 className="text-[10px] md:text-[14px] text-white">
            We built the most user friendly crypto wallet!
          </h2>
        </div>
        <div className="hidden md:inline-block h-[2px] bg-white opacity-10" />
        <div className="flex flex-col space-y-[8px]">
          <h3 className="text-[12px] md:text-[14px] font-bold text-white">
            Today&apos;s reward
          </h3>
          <div className="flex flex-row">
            <div className="flex flex-row items-center space-x-[6px]">
              <div className="flex flex-row items-center space-x-[6px]">
                <div className="p-[6px] bg-[#C64CB8] shadow-sm shadow-accent rounded-[10px]">
                  <img src="/tether.svg" alt="tether" className="h-[16px] w-[16px]" />
                </div>
                <h3 className="text-[12px] md:text-[14px] font-bold text-white">
                  100 USDT
                </h3>
              </div>
              <div className="text-white">+</div>
              <div className="flex flex-row items-center space-x-[6px]">
                <div className="p-[6px] bg-[#C64CB8] shadow-sm shadow-accent rounded-[10px]">
                  <img src="/logo.svg" alt="logo" className="h-[16px] w-[16px]" />
                </div>
                <h3 className="text-[12px] md:text-[14px] font-bold text-white">
                  10000 Kaiju Arcade Tokens
                </h3>
              </div>
            </div>
            <div
              className="flex flex-row items-center space-x-[7px]
              bg-[#F4BB76] rounded-[14px] ml-auto hover:scale-110 transition duration-300"
            >
              <a href="https://www.kaiju3d.com/" target="_blank">
            <button
              className="hidden md:inline-flex flex-row items-center md:space-x-[7px] px-[12px] py-[10px]
              bg-[#F4BB76] rounded-[14px] ml-auto hover:scale-110 transition duration-300"
            >
              <img src="/globe.svg" alt="globe" className="hidden md:inline-block h-[14px] w-[14px]" />
              <h3 className="text-[10px] md:text-[14px] text-[#13141C]">
                Visit site
              </h3>
            </button>
            </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsor;