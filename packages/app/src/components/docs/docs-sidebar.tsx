import * as React from "react";
import { Sidebar } from "../common/sidebar/sidebar";
import { SidebarHeader } from "../common/sidebar/sidebar-header";
import { SidebarItem } from "../common/sidebar/sidebar-item";
import {
  Typeguard,
  useFilteredDocsEntity,
  usePackageDocs,
} from "../../api/api-helpers";
import { useMemo } from "react";
import {
  isTsClass,
  isTsEnum,
  isTsInterface,
  isTsMethod,
  isTsTypeAlias,
  ITypescriptPluginData,
} from "@documentalist/client";
import { PackageSidebarItems } from "../package/package-sidebar-items";
import { useRouterQuery } from "../../common/use-router-query";
import { useHash } from "../../common/use-hash";
import { usePkgQuery } from "../../common/use-pkg-query";

const SidebarSection: React.FC<{
  docs: ITypescriptPluginData | undefined;
  guard: Typeguard<any>;
  title: string;
}> = props => {
  const hash = useHash();
  const { packageName, version } = useRouterQuery();
  const items = useFilteredDocsEntity(props.docs, props.guard);
  return !items ? null : (
    <>
      <SidebarHeader as="h2">{props.title}</SidebarHeader>
      {Object.entries(items).map(([key, value]) => (
        <SidebarItem
          href={`/${packageName}/${version}#${key}`}
          key={key}
          selected={hash === key}
        >
          {key}
        </SidebarItem>
      ))}
    </>
  );
};

export const DocsSidebar: React.FC<{
  currentKey?: string;
}> = ({ currentKey }) => {
  const { version, encodedPackageName } = usePkgQuery();
  const { data: docs, error } = usePackageDocs(encodedPackageName, version);

  return (
    <Sidebar>
      <PackageSidebarItems currentKey={currentKey} />
      <SidebarSection docs={docs} guard={isTsClass} title="Classes" />
      <SidebarSection docs={docs} guard={isTsEnum} title="Enums" />
      <SidebarSection docs={docs} guard={isTsInterface} title="Interfaces" />
      <SidebarSection docs={docs} guard={isTsMethod} title="Methods" />
      <SidebarSection docs={docs} guard={isTsTypeAlias} title="Type Aliases" />
    </Sidebar>
  );
};
