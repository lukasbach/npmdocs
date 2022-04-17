import { NextApiRequest, NextApiResponse } from "next";
import { getVersions } from "../../../src/github/get-versions";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { packageName } = req.query;
  const fixedPackage = (packageName as string).replace(/__/g, "/");
  res.status(200).json(await getVersions(fixedPackage));
};
