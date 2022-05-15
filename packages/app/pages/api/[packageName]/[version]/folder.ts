import { NextApiRequest, NextApiResponse } from "next";
import { getFile } from "../../../../src/github/helpers";
import { decompress } from "compress-json";
import { setCacheHeader } from "../../_setCacheHeader";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { packageName, version } = req.query;
  const fixedPackage = (packageName as string).replace(/__/g, "/");
  const result = await getFile<any>(
    `packages/${fixedPackage}/${version}/folder.json`
  );

  if (!result) {
    res.status(404).end();
    return;
  }

  setCacheHeader(res);
  res.status(200).json(decompress(result));
};
