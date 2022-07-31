import { useDocs } from "../provider/use-docs";
import { isDeclarationReflection } from "@lukasbach/npmdocs-typedoc-utils";
import type { JSONOutput } from "typedoc";
import { useLookedUpItem } from "../../../common/use-looked-up-item";
import React from "react";

const getParents = (
  reflection: JSONOutput.DeclarationReflection,
  list: number[][] = []
) => {
  if (list.length === 0) {
    list = [
      reflection.extendedTypes
        .map(type => (type as any)?.id)
        .filter(id => id !== undefined),
      [reflection.id],
    ];
  }

  if (reflection.extendedBy) {
    list.push(
      reflection.extendedBy
        .map(type => (type as any)?.id)
        .filter(id => id !== undefined)
    );
    for (const parent of reflection.extendedBy) {
      if (isDeclarationReflection(parent)) {
        getParents(parent, list);
      }
    }
  }

  return list;
};

const HierarchyItem = ({ id }: { id: number }) => {
  const item = useLookedUpItem(id);
  if (!item) {
    return null;
  }
  return <div>{item.item.reflection.name}</div>;
};

export const Hierarchy = () => {
  const { symbolDocs, error, packageName, version } = useDocs();

  if (!isDeclarationReflection(symbolDocs)) {
    return <>No Hierarchy available for symbol.</>;
  }

  const hierarchy = getParents(symbolDocs).reverse();

  return (
    <div>
      {hierarchy.map((layer, i) => (
        <div key={i}>
          (
          {layer.map(id => (
            <HierarchyItem id={id} key={id} />
          ))}
          )
        </div>
      ))}
    </div>
  );
};
