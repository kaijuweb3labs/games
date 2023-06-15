import { hexValue } from "@ethersproject/bytes";
import { REGEX_MAP } from "../constants/regex";

export const isMobile = (value: string) => {
  return (
    REGEX_MAP.mobileDevice.test(value) ||
    REGEX_MAP.mobileDeviceExtend.test(value.substring(0, 4))
  );
};

export const OpToJSON = (op: any): any => {
  return Object.keys(op)
    .map((key) => {
      let val = (op as any)[key];
      if (typeof val !== "string" || !val.startsWith("0x")) {
        val = hexValue(val);
      }
      return [key, val];
    })
    .reduce(
      (set, [k, v]) => ({
        ...set,
        [k]: v,
      }),
      {}
    ) as any;
};
