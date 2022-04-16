import { Octokit } from "@octokit/rest";

let cachedKit: Octokit | undefined;

export const kit = (auth?: string) => {
  if (!cachedKit) {
    cachedKit = new Octokit({
      auth: auth ?? process.env.NPMDOCS_GH_AUTH,
      // log: console,
    });
  }

  return cachedKit;
};
