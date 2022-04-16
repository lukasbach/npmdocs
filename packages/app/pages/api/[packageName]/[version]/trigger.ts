import { NextApiRequest, NextApiResponse } from "next";
import { dispatchWorkflow } from "../../../../src/api/helpers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(404).end();
    return;
  }

  const { packageName, version } = req.query;
  const fixedPackage = (packageName as string).replace(/__/g, "/");

  const { versions } = await fetch(
    `https://registry.npmjs.org/${fixedPackage}`
  ).then(res => res.json());

  if (!Object.keys(versions).includes(version as string)) {
    res.status(404).end();
    return;
  }

  await dispatchWorkflow({
    packageName,
    packageVersion: version,
  });

  res.status(204).end();
};
