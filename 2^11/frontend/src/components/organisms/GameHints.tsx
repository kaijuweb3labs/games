const GameHints: React.FC = () => {
  return (
    <div className="flex flex-row items-center justify-center">
      <p className="hidden lg:inline-block text-[10px] font-medium text-white text-center">
        HOW TO PLAY: &nbsp; Use your arrow keys to move the tiles. Tiles with the same number merge into one when they touch. Add them up to reach 2048!
      </p>
      <p className="lg:hidden text-[10px] font-medium text-white text-center">
        HOW TO PLAY: &nbsp; Use your fingers to move the tiles. Tiles with the same number merge into one when they touch. Add them up to reach 2048!
      </p>
    </div>
  );
};

export default GameHints;