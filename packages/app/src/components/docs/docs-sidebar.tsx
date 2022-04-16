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

const SidebarSection: React.FC<{
  docs: ITypescriptPluginData | undefined;
  guard: Typeguard<any>;
  title: string;
}> = props => {
  const items = useFilteredDocsEntity(props.docs, props.guard);
  return !items ? null : (
    <>
      <SidebarHeader>{props.title}</SidebarHeader>
      {Object.entries(items).map(([key, value]) => (
        <SidebarItem key={key}>{key}</SidebarItem>
      ))}
    </>
  );
};

export const DocsSidebar: React.FC<{
  packageName: string;
  packageVersion: string;
}> = ({ packageName, packageVersion }) => {
  const { data: docs, error } = usePackageDocs(packageName, packageVersion);

  return (
    <Sidebar>
      <SidebarSection docs={docs} guard={isTsClass} title="Classes" />
      <SidebarSection docs={docs} guard={isTsEnum} title="Enums" />
      <SidebarSection docs={docs} guard={isTsInterface} title="Interfaces" />
      <SidebarSection docs={docs} guard={isTsMethod} title="Methods" />
      <SidebarSection docs={docs} guard={isTsTypeAlias} title="Type Aliases" />
    </Sidebar>
  );
};
