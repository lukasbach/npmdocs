import { HeaderButton } from "../common/header/header-button";
import { HeaderListButton } from "../common/header/header-list-button";
import * as React from "react";
import { usePkgQuery } from "../../common/use-pkg-query";
import { usePackageJson } from "../../api/api-helpers";

interface Repository {
  url?: string;
  directory?: string;
}

export const ExternalLinks = () => {
  const { version, encodedPackageName, packageName } = usePkgQuery();
  const { data: packageJson } = usePackageJson(encodedPackageName, version);

  if (!packageJson) {
    return null;
  }

  const repository: Repository | string = packageJson?.repository;
  const repoUrl =
    typeof repository === "string"
      ? repository
      : "https://" +
        repository?.url
          .replace("git+ssh://", "")
          .replace(/\.git$/, "")
          .replace(/^git@/, "")
          .replaceAll(":", "/");

  return (
    <HeaderButton text="External Links">
      <HeaderListButton isExternal={true} href={repoUrl}>
        Repository
      </HeaderListButton>
      <HeaderListButton
        isExternal={true}
        href={`https://www.npmjs.com/package/${packageName}/v/${version}`}
      >
        NPM Page
      </HeaderListButton>
      <HeaderListButton
        isExternal={true}
        href={packageJson.homepage ?? repoUrl ?? "#"}
      >
        Homepage
      </HeaderListButton>
      <HeaderListButton
        isExternal={true}
        href={`https://bundlephobia.com/package/${packageName}@${version}`}
      >
        Bundlephobia
      </HeaderListButton>
      <HeaderListButton
        isExternal={true}
        href={`https://packagephobia.com/result?p=${packageName}@${version}`}
      >
        Packagephobia
      </HeaderListButton>
    </HeaderButton>
  );
};
