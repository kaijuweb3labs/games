import router from "next/router";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { GameStageEnum, createGameSessionThunk, selectGameStage, updateGameStage } from "@/redux/slices/game";
import { UserState, changeNewGamePressed, selectUser } from "@/redux/slices/user";

const NewGameButton: React.FC = () => {
  const reduxDispatch = useReduxDispatch();
  const userState: UserState = useReduxSelector(selectUser);
  const gameStage = useReduxSelector(selectGameStage);

  return (
    <button
      disabled={gameStage === GameStageEnum.INITIALIZING}
      className="w-full md:hidden items-center bg-[#a11bc2] py-[14px]
      cursor-pointer rounded-[14px] lg:hover:scale-110 transition duration-300 disabled:opacity-25"
      onClick={() => {
        reduxDispatch(updateGameStage(GameStageEnum.INITIALIZING));
        if (!userState.uid) {
          reduxDispatch(changeNewGamePressed(true));
          router.push({
            pathname: "/login",
            query: { returnUrl: router.asPath },
          });
        } else {
          reduxDispatch(createGameSessionThunk());
        }
      }}
    >
      <h1 className="text-[13px]  font-medium text-[#ffffff] ml-[8px]">
        New Game
      </h1>
    </button>
  );
};

export default NewGameButton;