import { useEffect, useMemo } from "react";
import LeaderboardRow from "./LeaderboardRow";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { fetchLeaderBoard, selectLeaderBoard } from "@/redux/slices/game";
import { selectActiveNetwork } from "@/redux/slices/wallet";
import { ScreenSizeBreakpoint, TilesScreenTransformFactor } from "@/constants/constants";

const Leaderboard: React.FC = () => {
  const reduxDispatch = useReduxDispatch();
  const activeNet = useReduxSelector(selectActiveNetwork);
  const leaderBoard = useReduxSelector(selectLeaderBoard);

  console.log(leaderBoard);

  useEffect(() => {
    reduxDispatch(fetchLeaderBoard());
  }, [activeNet]);

  const mobileLeaderboard = useMemo(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth <= 768) {
        return true;
      }
      return false;
    }
    return false;
  }, [window]);

  const leaderboardData = useMemo(() => {
    if (mobileLeaderboard) {
      return leaderBoard;
    }
    return leaderBoard.slice(3);
  }, [mobileLeaderboard, leaderBoard]);

  console.log(leaderboardData);

  return (
    leaderBoard && leaderBoard.length > 3 && (
      <div className="flex flex-4 flex-col bg-[#1C1D29] rounded-[30px] p-[16px] overflow-y-scroll no-scrollbar mt-[26px] lg:mt-0">
        <div className="overflow-y-scroll no-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-[8px] text-[12px] font-medium text-white"
                >
                  Place
                </th>
                <th
                  scope="col"
                  className="py-[8px] text-[12px] font-medium text-white"
                >
                  Player
                </th>
                <th
                  scope="col"
                  className="hidden lg:inline-block py-[8px] text-[12px] font-medium text-white"
                >
                  Points
                </th>
                <th
                  scope="col"
                  className="py-[8px] text-[12px] font-medium text-white"
                >
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((leader, ind) => {
                  return (
                    <LeaderboardRow
                      displayName={leader.profileName}
                      score={leader.score}
                      image={leader.profilePicture}
                      key={ind.toString()}
                      place={mobileLeaderboard ? ind+1 : ind+4} 
                      txHash={leader.transactionHash}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
        {/* <div className="mt-[8px]">
        <div className="flex flex-row items-center">
          <p className="text-[12px] font-medium text-white">Your rank</p>
          <p className="text-[12px] font-medium text-[#C64CB8] mx-auto">
            View more
          </p>
        </div>
        <table className="w-full">
          <LeaderboardRow borderVisible={false} />
        </table>
      </div> */}
      </div>
    )
  );
};

export default Leaderboard;
