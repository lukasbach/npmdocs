import React, { FC, useCallback, useMemo } from "react";
import { useDocs } from "../provider/use-docs";
import type { JSONOutput } from "typedoc";
import { SymbolItem } from "./symbol-item";
import { isContainerReflection } from "../../../common/guards";
import { useSettings } from "../../settings/use-settings";
import { ReflectionKind } from "../../../common/reflection-kind";

const isNumber = (value: any) => !isNaN(value);

export const SymbolGroup: FC<{ group: JSONOutput.ReflectionGroup }> = ({
  group,
}) => {
  const { symbolDocs } = useDocs();
  const { hideInheritedMembers, sortEnumsByValue } = useSettings();

  const sortEnums = useCallback(
    (itemA: number, itemB: number) => {
      const resolvedItemA =
        isContainerReflection(symbolDocs) &&
        symbolDocs.children.find(child => child.id === itemA);
      const resolvedItemB =
        isContainerReflection(symbolDocs) &&
        symbolDocs.children.find(child => child.id === itemB);
      return isNumber(resolvedItemA?.defaultValue) &&
        isNumber(resolvedItemB?.defaultValue)
        ? parseInt(resolvedItemA?.defaultValue) -
            parseInt(resolvedItemB?.defaultValue)
        : resolvedItemA?.defaultValue.localeCompare(
            resolvedItemB?.defaultValue
          );
    },
    [symbolDocs]
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
          isContainerReflection(symbolDocs) &&
          symbolDocs.children.find(child => child.id === childId);

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
