import { useSelector } from "react-redux";
import { State } from "../types/redux";


function useReduxStatePropertie<T = any>(key: keyof State) {
  const value = useSelector((state: State) => state[key]);

  // @ts-ignore
  return value as T;
};

export default useReduxStatePropertie;