import { useReduxSelector } from "@/redux/hooks";
import Medalist from "./Medalist";
import { selectLeaderBoard } from "@/redux/slices/game";
import TextAtom from "@/components/atoms/TextAtom";

const Medalists: React.FC = () => {
  const leaderBoard = useReduxSelector(selectLeaderBoard);
  return leaderBoard.length !== 0 ? (
    <div className="hidden lg:inline-flex flex-3 flex-row space-x-[9px] mt-[20px]">
      {leaderBoard[1] && (
        <Medalist
          rank={2}
          score={leaderBoard[1].score}
          displayName={leaderBoard[1].profileName}
          image={leaderBoard[1].profilePicture}
          txHash={leaderBoard[1].transactionHash}
        />
      )}
      {leaderBoard[0] && (
        <Medalist
          rank={1}
          score={leaderBoard[0].score}
          displayName={leaderBoard[0].profileName}
          image={leaderBoard[0].profilePicture}
          txHash={leaderBoard[0].transactionHash}
        />
      )}
      {leaderBoard[2] && (
        <Medalist
          rank={3}
          score={leaderBoard[2].score}
          displayName={leaderBoard[2].profileName}
          image={leaderBoard[2].profilePicture}
          txHash={leaderBoard[2].transactionHash}
        />
      )}
    </div>
  ) : (
    <div className="flex flex-3 flex-row space-x-[9px] mt-[20px] items-center justify-center">
      <TextAtom
        fontFamily="Exo 2"
        className="text-2xl font-bold text-center"
        color="#2f3146"
      >
        Play and get into leaderboard
      </TextAtom>
    </div>
  );
};

export default Medalists;
