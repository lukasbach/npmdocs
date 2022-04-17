import React, { FC } from "react";
import { SidebarHeader } from "../common/sidebar/sidebar-header";
import { SidebarItem } from "../common/sidebar/sidebar-item";

export const PackageSidebarItems: FC<{
  packageName: string;
  version: string;
}> = ({ packageName }) => {
  return (
    <>
      <SidebarHeader as="h1">{packageName}</SidebarHeader>
      <SidebarItem href={"#"}>About</SidebarItem>
      <SidebarItem href={"#"}>Readme</SidebarItem>
      <SidebarItem href={"#"}>Package Source</SidebarItem>
      <SidebarItem href={"#"}>Dependencies</SidebarItem>
      <SidebarItem href={"#"}>Dependents</SidebarItem>
      <SidebarItem href={"#"}>Versions</SidebarItem>
      <SidebarItem href={"#"}>Badges</SidebarItem>
      <SidebarItem href={"#"}>Search Package Contents</SidebarItem>
    </>
  );
};
