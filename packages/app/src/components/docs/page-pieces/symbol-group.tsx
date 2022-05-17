import React, { FC, ReactNode } from "react";
import { useDocs } from "../provider/use-docs";
import type { JSONOutput } from "typedoc";
import { SymbolItem } from "./symbol-item";

import style from "./styles.module.css";
import { isContainerReflection } from "../../../common/guards";

export const SymbolGroup: FC<{ group: JSONOutput.ReflectionGroup }> = ({
  group,
}) => {
  const { symbolDocs } = useDocs();
  return (
    <div>
      <h2>{group.title}</h2>
      {group.children.map(childId => {
        const item =
          isContainerReflection(symbolDocs) &&
          symbolDocs.children.find(child => child.id === childId);

        if (!item) {
          return null;
        }

        return <SymbolItem key={childId} item={item} />;
      })}
    </div>
  );
};
