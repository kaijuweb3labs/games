import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { setIsMintNftModalOpen } from "@/redux/slices/modals";
import AnimatedModal from "@/components/molecules/AnimatedModal";
import { useCallback, useContext } from "react";
import { GameStatsContext } from "../GameStats/GameStats";
import { GameContext } from "../GameProvider";
import { checkScoreValidation } from "@/redux/slices/transaction";
import { GameStageEnum, updateGameStage } from "@/redux/slices/game";

type NftMintProp = {
  mintNft: () => void;
  closeMint: () => void;
  show?: boolean;
};

const MintNftModal: React.FC<NftMintProp> = ({ mintNft, closeMint, show }) => {
  const { scoreState } = useContext(GameStatsContext);
  const { gameState } = useContext(GameContext);
  const dispatch = useReduxDispatch();
  const closeModal = () => {
    dispatch(setIsMintNftModalOpen(false));
    closeMint();
  };
  const handleAccept = useCallback(() => {
    // console.log("Minting the NFT..............");
    dispatch(updateGameStage(GameStageEnum.MINTING));
    dispatch(
      checkScoreValidation({
        gameMoves: gameState.moves,
        score: scoreState.score,
      })
    );
    mintNft();
  }, [dispatch, gameState.moves, mintNft, scoreState.score]);
  return (
    <AnimatedModal show={show} onClose={() => {}}>
      {show && (
        <div className="flex flex-col justify-center items-center">
          <div className="w-full my-[8px] flex flex-row">
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
            <h3 className="text-[18px] font-bold text-white mt-[24px]">
              You can get on the leaderboard
            </h3>
            <p className="w-[350px] text-[14px] text-white text-center mt-[6px]">
              This is your highest score, if you want to get eligible to the
              daily reward, mint your score as nft
            </p>
            <button
              className="bg-[#C64CB8] w-[175px] py-[11px] text-[12px]
            text-white rounded-[14px] mt-[16px]"
              onClick={handleAccept}
            >
              Mint NFT
            </button>
          </div>
        </div>
      )}
    </AnimatedModal>
  );
};

export default MintNftModal;
