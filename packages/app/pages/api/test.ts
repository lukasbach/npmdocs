import { NextApiRequest, NextApiResponse } from "next";
import { readdir, mkdir } from "fs-extra";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await mkdir(process.cwd() + "/test");
  await mkdir("./test");
  res.status(200).json({ dir: readdir(process.cwd()) });
};
