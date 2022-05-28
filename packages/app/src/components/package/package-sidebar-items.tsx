import React, { FC, ReactNode } from "react";
import { SidebarHeader } from "../common/sidebar/sidebar-header";
import { SidebarItem } from "../common/sidebar/sidebar-item";
import { usePkgQuery } from "../../common/use-pkg-query";
import { useEventBus } from "../../common/use-event-bus";

const Item: FC<{
  children: ReactNode;
  itemKey: string;
  packageName: string;
  version: string;
  currentKey: string;
  selected?: boolean;
}> = ({ packageName, version, itemKey, children, currentKey, selected }) => (
  <SidebarItem
    href={`/${packageName}/${version}/${itemKey}`}
    selected={itemKey === currentKey || selected}
  >
    {children}
  </SidebarItem>
);

export const PackageSidebarItems: FC<{
  currentKey?: string;
}> = ({ currentKey }) => {
  const { encodedPackageName, packageName, version } = usePkgQuery();
  const onOpenSearch = useEventBus("search");
  const common = { packageName: encodedPackageName, version, currentKey };
  return (
    <>
      <SidebarHeader as="h1">{packageName}</SidebarHeader>
      <Item {...common} itemKey="" selected={currentKey === "docs"}>
        Documentation
      </Item>
      <Item {...common} itemKey="readme">
        Readme
      </Item>
      <Item {...common} itemKey="source">
        Package Source
      </Item>
      <Item {...common} itemKey="dependencies">
        Dependencies
      </Item>
      <Item {...common} itemKey="versions">
        Versions
      </Item>
      <Item {...common} itemKey="badges">
        Badges
      </Item>
      <SidebarItem onClick={onOpenSearch}>Search symbol...</SidebarItem>
    </>
  );
};
