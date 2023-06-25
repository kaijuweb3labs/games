import React from "react";
import BalanceCard from "@/components/molecules/BalanceCard";
import TextAtom from "@/components/atoms/TextAtom";
import { useReduxSelector } from "@/redux/hooks";
import {
  selectAccountBalances,
  selectAllAssetsForNet,
} from "@/redux/slices/wallet";
import { NetworkBaseAsset } from "@/types/network";
function TokenBalances() {
  const balances = useReduxSelector(selectAccountBalances);
  const assets = useReduxSelector(selectAllAssetsForNet);
  
  return (
    <div className="w-[300px] pb-2 items-center">
      <div className="text-center mt-2">
        <TextAtom fontFamily="Exo 2" className="p-3  text-white">
          Balances
        </TextAtom>
      </div>
      <div className="mx-3 mt-3 space-y-1">
        {assets.map((asst: NetworkBaseAsset) => {
          return (
            <BalanceCard
              key={asst.id}
              image={asst.image}
              title={asst.symbol}
              balance={balances[asst.id]?.assetAmount?.coin || 0}
            />
          );
        })}
        {/* 
        <BalanceCard image={karc} title="KARC" balance="50" /> */}
      </div>
    </div>
  );
}

export default TokenBalances;
