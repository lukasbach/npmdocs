import React, { FC, useCallback, useMemo } from "react";
import { useDocs } from "../provider/use-docs";
import type { JSONOutput } from "typedoc";
import { SymbolItem } from "./symbol-item";
import { isContainerReflection } from "@lukasbach/npmdocs-typedoc-utils";
import { useSettings } from "../../settings/use-settings";
import { ReflectionKind } from "../../../common/reflection-kind";

const isNumber = (value: any) => !isNaN(value);

export const SymbolGroup: FC<{
  group: JSONOutput.ReflectionGroup;
  docsRoot?: JSONOutput.ContainerReflection;
}> = ({ group, docsRoot: maybeDocsRoot }) => {
  const { symbolDocs } = useDocs();
  const { hideInheritedMembers, sortEnumsByValue } = useSettings();
  const docsRoot = maybeDocsRoot ?? symbolDocs;

  const sortEnums = useCallback(
    (itemA: number, itemB: number) => {
      const resolvedItemA =
        isContainerReflection(docsRoot) &&
        docsRoot.children.find(child => child.id === itemA);
      const resolvedItemB =
        isContainerReflection(docsRoot) &&
        docsRoot.children.find(child => child.id === itemB);
      return isNumber(resolvedItemA?.defaultValue) &&
        isNumber(resolvedItemB?.defaultValue)
        ? parseInt(resolvedItemA?.defaultValue) -
            parseInt(resolvedItemB?.defaultValue)
        : resolvedItemA?.defaultValue.localeCompare(
            resolvedItemB?.defaultValue
          );
    },
    [docsRoot]
  );

  const list = useMemo(
    () =>
      group.kind === ReflectionKind.EnumMember && sortEnumsByValue
        ? [...group.children].sort(sortEnums)
        : group.children,
    [group, sortEnumsByValue]
  );

  return (
    <div>
      <h2>{group.title}</h2>
      {list.map(childId => {
        const item =
          isContainerReflection(docsRoot) &&
          docsRoot.children.find(child => child.id === childId);

        if (!item) {
          return null;
        }

        if (item.inheritedFrom && hideInheritedMembers) {
          return null;
        }

        return <SymbolItem key={childId} item={item} />;
      })}
    </div>
  );
};
