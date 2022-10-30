import { NextApiRequest, NextApiResponse } from "next";
import { getVersions } from "../../../../src/github/get-versions";
import { buildPackage } from "../../../../src/backend/buildtools";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(404).json({ error: "Must be POST request." });
    return;
  }

  const { packageName, version } = req.query;
  const fixedPackage = (packageName as string).replace(/__/g, "/");

  const versions = await getVersions(fixedPackage);
  if (!Object.keys(versions).includes(version as string)) {
    console.log(versions, version, fixedPackage);
    res.status(404).json({ error: "Requested version not available on NPM." });
    return;
  }

  if (versions[version as string].built) {
    res.status(410).json({ error: "This version has already been built." });
    return;
  }

  const build = buildPackage(fixedPackage, version as string);
  res.status(204).end();
  try {
    await build;
  } catch (e) {
    console.error(e);
  }
};
