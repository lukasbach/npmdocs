import { useDocs } from "../components/docs/provider/use-docs";
import { useMemo } from "react";
import { isContainerReflection, isProject } from "./guards";

export const useLookedUpItem = (id?: number) => {
  const { lookupMap } = useDocs();

  return useMemo(() => {
    if (!id) {
      return null;
    }

    const item = lookupMap.get(id);

    if (!item) {
      return null;
    }

    const path = [];
    let targetUrl = "";
    let currentItem = item;
    while (currentItem) {
      path.push(currentItem.reflection.name);
      if (!isProject(currentItem.reflection)) {
        const sep =
          currentItem.parent && !isProject(currentItem.parent.reflection)
            ? isContainerReflection(currentItem.reflection)
              ? "."
              : ":"
            : "";
        targetUrl = `${sep}${currentItem.reflection.name}${targetUrl}`;
      }
      currentItem = currentItem.parent;
    }

    return { item, path: path.reverse(), targetUrl, ...item };
  }, [lookupMap, id]);
};
