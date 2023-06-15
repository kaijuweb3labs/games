import React, { useCallback, useEffect, useReducer } from "react";

export const GAME_ID = "2048game";

const useStateReducer = (prevState, newState) => {
  return typeof newState === "function" ? newState(prevState) : newState;
};

const getInitialValue = (key: string, defaultValue: any) => {
  
  try {
    const gameState = JSON.parse(window?.localStorage.getItem(GAME_ID));
    const value = gameState?.[key];
    //console.log('Read File |||||||||||||||||||||||||||||||||||||||||||||', 'value:', value, 'gameState:', gameState)
    return value ?? defaultValue;
  } catch (error) {
    console.log(error);
    return defaultValue;
  }
};

function useGameLocalStorage<T>(
  key: string,
  defaultValue: T,
  reducer = useStateReducer
): [T, React.Dispatch<any>] {

  const newInitState = useCallback(()=>{
    return getInitialValue(key, defaultValue)
  },[])

  const [value, dispatch] = useReducer(
    reducer,
    newInitState()
  );

  useEffect(() => {
    let state = JSON.parse(window?.localStorage.getItem(GAME_ID)) || {};
    //console.log("Save File |||||||||||||||||||||||||||||||||", 'value:', value, 'State:', state)
    state[key] = value;
    window?.localStorage.setItem(GAME_ID, JSON.stringify(state));
  }, [value, key]);
  return [value, dispatch];
}

export default useGameLocalStorage;
