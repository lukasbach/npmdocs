import { NextApiRequest, NextApiResponse } from "next";
import { getRecentCommits } from "../../src/github/helpers";
import { setCacheHeader } from "./_setCacheHeader";

const skipTags = ["#failed", "#skiprecent"];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const commits = await getRecentCommits(30, "npmdocs-noreply@lukasbach.com");
  setCacheHeader(res, 60 * 2);
  res.status(200).json(
    commits
      .map(commit => {
        if (skipTags.some(tag => commit.commit.message.includes(tag))) {
          return null;
        }

        const packageAndVersion = commit.commit.message.split(" ")[1];
        const scoped = packageAndVersion.startsWith("@");
        const packageAndVersionWithoutPrefix = scoped
          ? packageAndVersion.substr(1)
          : packageAndVersion;
        const [packageName, version] =
          packageAndVersionWithoutPrefix.split("@");
        return { packageName: `${scoped ? "@" : ""}${packageName}`, version };
      })
      .filter(v => !!v)
  );
};
