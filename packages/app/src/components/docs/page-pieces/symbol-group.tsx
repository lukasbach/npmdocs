import React, { FC, ReactNode } from "react";
import { useDocs } from "../provider/use-docs";
import type { JSONOutput } from "typedoc";
import { SymbolItem } from "./symbol-item";

import style from "./styles.module.css";

export const SymbolGroup: FC<{ group: JSONOutput.ReflectionGroup }> = ({
  group,
}) => {
  const { symbolDocs } = useDocs();
  return (
    <div>
      <h2>{group.title}</h2>
      {group.children.map(childId => {
        const item = symbolDocs.children.find(child => child.id === childId);

        if (!item) {
          return null;
        }

        return <SymbolItem key={childId} item={item} />;
      })}
    </div>
  );
};
