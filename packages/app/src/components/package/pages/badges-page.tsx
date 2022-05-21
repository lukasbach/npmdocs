import React, { FC, ReactNode } from "react";

import style from "./styles.module.css";
import { useDocs } from "../../docs/provider/use-docs";
import { ListContainer } from "../../common/list/list-container";
import { usePackageVersions } from "../../../api/api-helpers";
import { ListItem } from "../../common/list/list-item";
import { useCopyToClipboard } from "react-use";

const BadgeItem: FC<{
  url: string;
  label: string;
}> = ({ url, label }) => {
  const [state, copy] = useCopyToClipboard();
  return (
    <ListItem
      right={state.value ? "Copied markdown to clipboard" : label}
      onClick={() => copy(`![${label}](${url})`)}
    >
      <img alt="Badge" src={url} />
    </ListItem>
  );
};

export const BadgesPage: FC<{}> = () => {
  const { packageName, encodedPackageName, version } = useDocs();
  // TODO github badges
  return (
    <div>
      <h1>{packageName} Badges</h1>
      <ListContainer>
        <BadgeItem
          url={`https://badgen.net/npm/v/${packageName}`}
          label="npm version"
        />
        <BadgeItem
          url={`https://badgen.net/npm/dw/${packageName}`}
          label="weekly downloads on npm"
        />
        <BadgeItem
          url={`https://badgen.net/npm/dm/${packageName}`}
          label="monthly downloads on npm"
        />
        <BadgeItem
          url={`https://badgen.net/npm/dy/${packageName}`}
          label="yearly downloads on npm"
        />
        <BadgeItem
          url={`https://badgen.net/npm/dt/${packageName}`}
          label="total downloads on npm"
        />

        <BadgeItem
          url={`https://badgen.net/npm/node/${packageName}`}
          label="node version"
        />
        <BadgeItem
          url={`https://badgen.net/npm/dependents/${packageName}`}
          label="dependents on npm"
        />
        <BadgeItem
          url={`https://badgen.net/npm/types/${packageName}`}
          label="types included"
        />

        <BadgeItem
          url={`https://badgen.net/packagephobia/install/${packageName}`}
          label="install size on packagephobia"
        />
        <BadgeItem
          url={`https://badgen.net/packagephobia/publish/${packageName}`}
          label="publish size on packagephobia"
        />

        <BadgeItem
          url={`https://badgen.net/bundlephobia/min/${packageName}`}
          label="minified size on bundlephobia"
        />
        <BadgeItem
          url={`https://badgen.net/bundlephobia/minzip/${packageName}`}
          label="minzipped size on bundlephobia"
        />
        <BadgeItem
          url={`https://badgen.net/bundlephobia/dependency-count/${packageName}`}
          label="dependency count on bundlephobia"
        />
        <BadgeItem
          url={`https://badgen.net/bundlephobia/tree-shaking/${packageName}`}
          label="tree shaking support"
        />
      </ListContainer>
    </div>
  );
};
