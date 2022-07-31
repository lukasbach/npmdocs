import { NextApiRequest, NextApiResponse } from "next";
import { setCacheHeader } from "../../_setCacheHeader";
import { getFile } from "../../../../src/github/helpers";

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
    const fixedPackage = (packageName as string).replace(/__/g, "/");
    const result = await getFile<any>(
      `packages/${fixedPackage}/${version}/readme.md`,
      false
    );

    if (!result) {
      res.status(404).end();
      return;
    }

    setCacheHeader(res);
    res.status(200).json({
      readme: result,
    });
  } else {
    setCacheHeader(res);
    res.status(200).json({
      readme: versionWithReadme.readme,
    });
  }
};
