import type { JSONOutput } from "typedoc";
import { getTraversableItems } from "./traversable-items";
import { isReflection } from "./guards";
import { ReflectionKind } from "./reflection-kind";

export const constructLookupMap = (reflection: JSONOutput.Reflection) => {
  const map = new Map<number, LookupMapItem>();

  if (!reflection) {
    return map;
  }

  traverse(map, reflection);

  return map;
};

export interface LookupMapItem {
  reflection: JSONOutput.Reflection;
  parent?: LookupMapItem;
}

const traverse = (
  map: Map<number, LookupMapItem>,
  reflection: JSONOutput.Reflection | JSONOutput.SomeType,
  parent?: LookupMapItem
) => {
  if (
    !isReflection(reflection) ||
    reflection.kind === ReflectionKind.Reference
  ) {
    return;
  }

  const item = {
    reflection,
    parent,
  };

  map.set(reflection.id, item);

  for (const child of getTraversableItems(reflection)) {
    traverse(map, child, item);
  }
};
