import { NextApiResponse } from "next";

export const oneDay = 60 * 60 * 24;
export const twoWeeks = oneDay * 14;

export const setCacheHeader = (res: NextApiResponse, age = twoWeeks) => {
  res.setHeader("Cache-Control", `s-maxage=${age}`);
};
