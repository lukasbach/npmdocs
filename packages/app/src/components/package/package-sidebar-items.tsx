import React, { FC, ReactNode } from "react";
import { SidebarHeader } from "../common/sidebar/sidebar-header";
import { SidebarItem } from "../common/sidebar/sidebar-item";
import { usePkgQuery } from "../../common/use-pkg-query";

const Item: FC<{
  children: ReactNode;
  itemKey: string;
  packageName: string;
  version: string;
  currentKey: string;
}> = ({ packageName, version, itemKey, children, currentKey }) => (
  <SidebarItem
    href={`/${packageName}/${version}/${itemKey}`}
    selected={itemKey === currentKey}
  >
    {children}
  </SidebarItem>
);

export const PackageSidebarItems: FC<{
  currentKey?: string;
}> = ({ currentKey }) => {
  const { encodedPackageName, packageName, version } = usePkgQuery();
  const common = { packageName: encodedPackageName, version, currentKey };
  return (
    <>
      <SidebarHeader as="h1">{packageName}</SidebarHeader>
      <Item {...common} itemKey="">
        About
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
    </>
  );
};
