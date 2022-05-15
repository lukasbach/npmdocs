import { NextApiRequest, NextApiResponse } from "next";
import { getVersions } from "../../../src/github/get-versions";
import { setCacheHeader } from "../_setCacheHeader";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { packageName } = req.query;
  const fixedPackage = (packageName as string).replace(/__/g, "/");
  setCacheHeader(res, 60 * 20);
  res.status(200).json(await getVersions(fixedPackage));
};
