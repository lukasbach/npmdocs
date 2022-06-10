import React, { FC, ReactNode } from "react";

import style from "./styles.module.css";
import { useDocs } from "../../docs/provider/use-docs";
import { ListContainer } from "../../common/list/list-container";
import { usePackageJson, usePackageVersions } from "../../../api/api-helpers";
import { ListItem } from "../../common/list/list-item";

export const DependenciesPage: FC<{}> = () => {
  const { version, encodedPackageName, packageName } = useDocs();
  const { data } = usePackageJson(encodedPackageName, version);
  return (
    <div>
      <h1>Dependencies of {packageName}</h1>

      <h2>Dependencies</h2>
      <ListContainer>
        {data?.dependencies &&
          Object.entries(data.dependencies).map(([pkg, v]) => (
            <ListItem
              key={pkg}
              href={`/${pkg.replace("/", "__")}`}
              right={<>{v}</>}
            >
              {pkg}
            </ListItem>
          ))}
      </ListContainer>

      <h2>Dev Dependencies</h2>
      <ListContainer>
        {data?.devDependencies &&
          Object.entries(data.devDependencies).map(([pkg, v]) => (
            <ListItem
              key={pkg}
              href={`/${pkg.replace("/", "__")}`}
              right={<>{v}</>}
            >
              {pkg}
            </ListItem>
          ))}
      </ListContainer>
    </div>
  );
};
