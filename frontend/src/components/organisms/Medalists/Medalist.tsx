import { convertToScoreFormat } from "@/utils/helpers/number";
import Reward from "../Reward";
import Link from "next/link";
import { TX_SCAN_URL } from "@/config";

type MedalistProps = {
  rank: number;
  score: number;
  displayName: string;
  image: string;
  txHash: string;
};


const Medalist: React.FC<MedalistProps> = ({
  rank,
  score,
  image,
  displayName,
  txHash
}) => {
  const headerFlex =
    rank === 2 ? " flex-1" : rank === 1 ? " flex-2" : " flex-3";
  const footerFlex =
    rank === 2 ? " flex-1" : rank === 1 ? " flex-3" : " flex-2";
  const gradient = rank === 1 ? " from-[#F4BB76]/30" : " from-[#1C1D29]";
  const rankText = rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd";
  const trophyBg =
    rank === 1
      ? " bg-[#F4BB76]"
      : rank === 2
      ? " bg-[#F47E76]"
      : " bg-[#C64CB8]";
  return (
    <div className="flex flex-1 flex-col space-y-[8px]">
      <div
        className={
          `flex flex-col items-center space-y-[3px] justify-end` + headerFlex
        }
      >
        <img
          src={image !== '' && image !== undefined ? image : '/profilePlaceholder.svg'} 
          alt="Profile"
          className="h-[48px] w-[48px] rounded-full"
        />
        <h3 className="text-[14px] font-bold text-white">{displayName}</h3>
        <h4 className="text-[10px] font-medium text-[#F4BB76]">
          {convertToScoreFormat(score)} Points
        </h4>
      </div>
      <Link href={`${TX_SCAN_URL}/tx/${txHash}`}  rel="noopener noreferrer" target="_blank"
        className={
          `flex flex-col items-center justify-between bg-gradient-to-b p-[16px] pb-[20px] rounded-t-[30px] space-y-[10px]` +
          footerFlex +
          gradient
        }
      >
        <div className="flex flex-row items-center space-x-[8px] justify-center" >
          <div className={"p-[6px] rounded-[10px]" + trophyBg}>
            <img src="/trophy.svg" alt="Trophy" className="h-[16px] w-[16px]" />
          </div>
          <h3 className="text-[14px] font-bold text-white">{rankText}</h3>
        </div>
        <Reward rank={rank} />
      </Link>
    </div>
  );
};

export default Medalist;
