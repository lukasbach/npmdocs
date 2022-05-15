import { NextApiRequest, NextApiResponse } from "next";
import { oneDay, setCacheHeader } from "../_setCacheHeader";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { packageName } = req.query;
  const fixedPackage = (packageName as string).replace(/__/g, "/");
  const data = await fetch(`https://registry.npmjs.org/${fixedPackage}`).then(
    res => res.json()
  );
  setCacheHeader(res, oneDay);
  res.status(200).json({
    readme: data.readme,
    bugs: data.bugs,
    license: data.license,
    readmeFilename: data.readmeFilename,
    keywords: data.keywords,
    repository: data.repository,
    homepage: data.homepage,
    author: data.author,
    maintainers: data.maintainers,
    name: data.name,
    description: data.description,
  });
};
