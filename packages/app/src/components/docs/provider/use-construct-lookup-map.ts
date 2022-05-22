import type { JSONOutput } from "typedoc";
import { useMemo } from "react";
import { isContainerReflection } from "../../../common/guards";

export interface LookupMapItem {
  reflection: JSONOutput.Reflection;
  parent?: LookupMapItem;
}

const traverse = (
  map: Map<number, LookupMapItem>,
  reflection: JSONOutput.Reflection,
  parent?: LookupMapItem
) => {
  const item = {
    reflection,
    parent,
  };

  map.set(reflection.id, item);

  if (isContainerReflection(reflection)) {
    for (const child of reflection.children) {
      traverse(map, child, item);
    }
  }
};

export const useConstructLookupMap = (reflection?: JSONOutput.Reflection) => {
  return useMemo(() => {
    const map = new Map<number, LookupMapItem>();

    if (!reflection) {
      return map;
    }

    traverse(map, reflection);

    return map;
  }, [reflection]);
};
