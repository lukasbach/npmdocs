import React, { FC, ReactNode, useState } from "react";
import { useRouterQuery } from "../../common/use-router-query";
import { usePackageSource } from "../../api/api-helpers";
import { Sidebar } from "../common/sidebar/sidebar";
import { PackageSidebarItems } from "../package/package-sidebar-items";
import {
  IoChevronDownSharp,
  IoChevronForwardSharp,
  IoReaderOutline,
} from "react-icons/io5";
import { SidebarHeader } from "../common/sidebar/sidebar-header";
import { SidebarItem } from "../common/sidebar/sidebar-item";

const Item: FC<{
  items: Record<string, boolean | any>;
  depth: number;
  parentPath: string;
  fileName: string;
  content: true | any;
}> = ({ fileName, content, items, parentPath, depth }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <SidebarItem
        href={content === true ? `#${parentPath}/${fileName}` : null}
        onClick={() => setIsExpanded(!isExpanded)}
        indent={depth}
      >
        {content === true ? (
          <IoReaderOutline />
        ) : isExpanded ? (
          <IoChevronDownSharp />
        ) : (
          <IoChevronForwardSharp />
        )}
        {fileName}
      </SidebarItem>
      {isExpanded && content !== true && (
        <Folder
          items={content}
          depth={depth + 1}
          parentPath={`${parentPath}/${fileName}`}
        />
      )}
    </>
  );
};

const Folder: FC<{
  items: Record<string, boolean | any>;
  depth: number;
  parentPath: string;
}> = ({ items, parentPath, depth }) => {
  return (
    <>
      {Object.entries(items)
        .sort(([aName, aContents], [bName, bContents]) =>
          aContents !== true && bContents === true
            ? -1
            : aContents === true && bContents !== true
            ? 1
            : aName.localeCompare(bName)
        )
        .map(([fileName, content]) => (
          <Item
            key={fileName}
            items={items}
            depth={depth}
            parentPath={parentPath}
            fileName={fileName}
            content={content}
          />
        ))}
    </>
  );
};

export const SourceSidebar: FC<{}> = () => {
  const { packageName, version } = useRouterQuery();
  const { data: source } = usePackageSource(packageName, version);
  if (!source) {
    return null;
  }

  return (
    <Sidebar>
      <PackageSidebarItems currentKey="source" />
      <SidebarHeader as="h2">Package Source</SidebarHeader>
      <Folder items={source.package as any} depth={0} parentPath={""} />
    </Sidebar>
  );
};
