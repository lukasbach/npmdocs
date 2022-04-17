import { NextApiRequest, NextApiResponse } from "next";
import {
  dispatchWorkflow,
  getWorkflowRuns,
} from "../../../../src/github/helpers";
import { getVersions } from "../../../../src/github/get-versions";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(404).json({ error: "Must be POST request." });
    return;
  }

  const currentRuns = (await getWorkflowRuns("in_progress")).count;

  if (currentRuns >= 3) {
    res.status(429).json({
      error:
        "There are currently too many in-progress builds, try again later.",
    });
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

  await dispatchWorkflow({
    packageName: fixedPackage,
    packageVersion: version,
  });

  res.status(204).end();
};
