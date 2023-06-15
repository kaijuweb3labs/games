const GameHints: React.FC = () => {
  return (
    <div className="flex flex-row items-center justify-between">
      <button
        className="hidden lg:inline-block bg-[#C64CB8] w-[245px] py-[11px] text-[12px]
        text-white rounded-[14px] lg:hover:scale-110 transition duration-300"
      >
        Become a sponsor
      </button>
      <p className="text-[10px] font-medium text-white lg:ml-[70px]">
        HOW TO PLAY: Use your arrow keys to move the tiles. Tiles with the same number merge into one when they touch. Add them up to reach 2048!
      </p>
    </div>
  );
};

export default GameHints;