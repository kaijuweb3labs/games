import React from 'react';
import { useReduxDispatch, useReduxSelector } from '@/redux/hooks';
import AnimatedModal from '@/components/molecules/AnimatedModal';
import { setIsBalancesModalOpen } from '@/redux/slices/modals';
import { selectAccountBalances, selectAllAssetsForNet } from '@/redux/slices/wallet';
import BalanceCard from '@/components/molecules/BalanceCard';
import { NetworkBaseAsset } from '@/types/network';

const BalancesModal: React.FC = () => {
  const isOpen = useReduxSelector((state) => state.modals.isBalancesModalVisible);
  const dispatch = useReduxDispatch();

  const balances = useReduxSelector(selectAccountBalances);
  const assets = useReduxSelector(selectAllAssetsForNet);

  const closeModal = () => {
    dispatch(setIsBalancesModalOpen(false));
  };

  return (
    <AnimatedModal show={isOpen} onClose={closeModal}>
      <div className="flex flex-col justify-center items-center">
        <div className='w-full my-[8px] flex flex-row'>
          <div
            className="p-2 rounded-full hover:bg-[#424563] ml-auto "
            onClick={closeModal}
          >
            <img src="/close.svg" alt="Close" className="h-[14px] w-[14px]" />
          </div>
        </div>
        <div className="w-full space-y-1 p-[20px]">
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
      </div>
      </div>
    </AnimatedModal>
  );
}

export default BalancesModal