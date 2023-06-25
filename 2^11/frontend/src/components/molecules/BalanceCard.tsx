import React from "react";
import TextAtom from "../atoms/TextAtom";
import Image, { StaticImageData } from "next/image";
import { ImageType } from "@/types/common";

export type BalanceCardProps = {
  image: ImageType;
  title: string;
  balance: string;
};
const BalanceCard: React.FC<BalanceCardProps> = ({ image, title, balance }) => {
  return (
    <div className="flex items-center w-full h-[60px] bg-[#13141C] rounded-[24px] ">
      <div className="flex flex-1 justify-center content-center">
        <Image
          className="rounded"
          src={image}
          width={24}
          height={24}
          alt="usdt"
        />
      </div>
      <div className="flex-2">
        <TextAtom>{title}</TextAtom>
      </div>
      <div className="flex-1">
        <TextAtom>{balance}</TextAtom>
      </div>
    </div>
  );
};

export default BalanceCard;
