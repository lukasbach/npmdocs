import { NextApiRequest, NextApiResponse } from "next";
import { readdir, mkdir } from "fs-extra";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await mkdir("/tmp/test");
  res.status(200).json({ dir: readdir(process.cwd()) });
};
