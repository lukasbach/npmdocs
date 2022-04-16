import { NextApiRequest, NextApiResponse } from "next";
import { getFolderContents } from "../../../src/api/helpers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { packageName } = req.query;
  const fixedPackage = (packageName as string).replace(/__/g, "/");
  const allVersionsPromise = fetch(
    `https://registry.npmjs.org/${fixedPackage}`
  ).then(res => res.json());
  const generatedVersionsPromise = getFolderContents(
    `packages/${fixedPackage}`
  );
  const [allVersions, generatedVersions] = await Promise.all([
    allVersionsPromise,
    generatedVersionsPromise,
  ]);
  const versions = Object.keys(allVersions.versions);
  const result = versions.reduce(
    (acc, version) => ({
      ...acc,
      [version]: {
        time: allVersions.time[version],
        built: generatedVersions?.includes(version) ?? false,
      },
    }),
    [] as string[]
  );
  res.status(200).json(result);
};
