import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { packageName, version } = req.query;
  const fixedPackage = (packageName as string).replace(/__/g, "/");
  const data = await fetch(`https://registry.npmjs.org/${fixedPackage}`).then(
    res => res.json()
  );
  const versions: any[] = Object.values(data.versions).reverse();
  versions.slice(versions.findIndex(v => v.version === version));
  const versionWithReadme = versions.find(v => v.readme?.length);

  if (!versionWithReadme) {
    res.status(404).json({
      error: "No readme found",
    });
  } else {
    res.status(200).json({
      readme: versionWithReadme.readme,
    });
  }
};
