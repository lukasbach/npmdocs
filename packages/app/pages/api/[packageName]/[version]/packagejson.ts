import { NextApiRequest, NextApiResponse } from "next";
import { setCacheHeader } from "../../_setCacheHeader";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { packageName, version } = req.query;
  const fixedPackage = (packageName as string).replace(/__/g, "/");
  const data = await fetch(`https://registry.npmjs.org/${fixedPackage}`).then(
    res => res.json()
  );
  setCacheHeader(res);
  res.status(200).json(data.versions[version as string]);
};
