import * as React from "react";
import { Sidebar } from "../common/sidebar/sidebar";
import { SidebarHeader } from "../common/sidebar/sidebar-header";
import { SidebarItem } from "../common/sidebar/sidebar-item";
import { Typeguard, useFilteredDocsEntity } from "../../api/api-helpers";
import { ITypescriptPluginData } from "@documentalist/client";
import { PackageSidebarItems } from "../package/package-sidebar-items";
import { useRouterQuery } from "../../common/use-router-query";
import { useHash } from "../../common/use-hash";
import { useDocs } from "./provider/use-docs";
import { isNamespace } from "../../common/guards";

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
  const {
    moduleGroups,
    groups,
    docsBaseUrl,
    route,
    getRouteInNamespace,
    hash,
    error,
  } = useDocs();

  if (error) {
    return null;
  }

  return (
    <Sidebar>
      <PackageSidebarItems currentKey={currentKey} />

      <SidebarHeader as="h2">Exports</SidebarHeader>
      <SidebarItem href={`/${docsBaseUrl}#`} selected={route.length === 0}>
        Global Exports
      </SidebarItem>
      {groups.find(isNamespace)?.resolvedChildren.map(namespace => (
        <SidebarItem
          href={`/${docsBaseUrl}#${namespace.name}`}
          key={namespace.name}
          selected={route[0] === namespace.name}
        >
          {namespace.name}
        </SidebarItem>
      ))}

      {moduleGroups
        .filter(group => !isNamespace(group))
        .map(({ title, resolvedChildren }) => (
          <React.Fragment key={title}>
            <SidebarHeader as="h2">{title}</SidebarHeader>
            {resolvedChildren.map(({ name }) => (
              <SidebarItem
                href={getRouteInNamespace(name)}
                key={name}
                selected={hash.endsWith(name)}
              >
                {name}
              </SidebarItem>
            ))}
          </React.Fragment>
        ))}
    </Sidebar>
  );
};
