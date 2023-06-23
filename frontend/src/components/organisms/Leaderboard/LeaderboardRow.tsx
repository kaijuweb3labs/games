import { convertToScoreFormat } from "@/utils/helpers/number";
import Reward from "../Reward";
import Link from "next/link";
import { useReducer } from "react";
import { useRouter } from "next/router";
import { TX_SCAN_URL } from "@/config";

type LeaderboardRowProps = {
  borderVisible?: boolean;
  displayName: string;
  score: number;
  place: number;
  image: string;
  txHash: string;
};

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  borderVisible = true,
  displayName,
  score,
  place,
  image,
  txHash
}) => {

  let style = borderVisible
  ? "hover:bg-[#2F3146] transition duration-300 cursor-pointer"
  : "";

  style += place === 1 || place === 2 || place === 3 ? " bg-[#2D2727]" : "";
  style += place !== 1 && place !== 4 ? " border-t-[1px] border-white/10 " : "";

  return (
    <tr
      onClick={()=>{
        window.open(`${TX_SCAN_URL}/tx/${txHash}`)
      }
      }
      className={style}
    >
      <td className={`${place === 1 ? 'rounded-tl-[10px]' : ''} ${place === 3 ? 'rounded-bl-[10px]' : ''}`}>
        <div className="flex flex-row items-center space-x-[6px] py-[12px] -translate-y-[8px] md:translate-y-0">
          <img className="h-[14px] w-[14px]" src="/star.svg" alt="Star" />
          <p className="text-[14px] text-white font-normal">{place}</p>
        </div>
      </td>
      <td>
        <div className="flex flex-row items-start space-x-[6px] py-[12px]">
          <img
            className="h-[20px] w-[20px] rounded-full"
            src={image !== '' && image !== undefined ? image : '/profilePlaceholder.svg'}
            alt="Profile"
          />
          <div className="flex flex-col">
            <p className="text-[14px] text-white font-normal">{displayName}</p>
            <p className="lg:hidden text-[10px] text-[#676A8E] font-medium">{score}</p>
          </div>
        </div>
      </td>
      <td className="hidden lg:inline-block">
        <p className="text-[14px] text-white font-normal py-[12px]">{convertToScoreFormat(score)}</p>
      </td>
      <td className={`${place === 3 ? 'rounded-br-[10px]' : ''} ${place === 1 ? 'rounded-tr-[10px]' : ''}`}>
        <div className="my-[8px]">
          <Reward rank={place === 1 || place === 2 || place === 3 ? place : "others"} />
        </div>
      </td>
    </tr>
  );
};

export default LeaderboardRow;
