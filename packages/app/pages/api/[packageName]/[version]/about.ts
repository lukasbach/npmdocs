import { NextApiRequest, NextApiResponse } from "next";
import { setCacheHeader } from "../../_setCacheHeader";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { packageName, version } = req.query;
  const fixedPackage = (packageName as string).replace(/__/g, "/");
  const {
    hasSideEffects,
    isModuleType,
    size,
    gzip,
  }: {
    gzip?: number;
    size?: number;
    hasSideEffects?: string[];
    isModuleType?: boolean;
  } = await fetch(
    `https://bundlephobia.com/api/size?package=${fixedPackage}@${version}&record=true`
  )
    .then(res => res.json())
    .catch(() => ({}));
  setCacheHeader(res);

  res.status(200).json({
    gzip,
    size,
    hasSideEffects,
    isModuleType,
    hasBundlephobiaLoaded: gzip !== undefined,
  });
};
