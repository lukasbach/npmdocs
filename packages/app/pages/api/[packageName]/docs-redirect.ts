import { NextApiRequest, NextApiResponse } from "next";
import { getVersions } from "../../../src/github/get-versions";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { packageName } = req.query;

  if (!packageName) {
    res.redirect("/");
    return;
  }

  const fixedPackage = (packageName as string).replace(/__/g, "/");
  const versions = await getVersions(fixedPackage);
  const versionToRedirectTo =
    Object.entries(versions).find(([version, { built }]) => built)?.[0] ??
    Object.keys(versions)[0];
  res.redirect(`/${packageName}/${versionToRedirectTo}`);
};
