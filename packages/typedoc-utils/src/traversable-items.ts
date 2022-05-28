import type { JSONOutput } from "typedoc";
import { isContainerReflection } from "./guards";

export const getTraversableItems = (reflection: JSONOutput.Reflection) => {
  const items: JSONOutput.Reflection[] = [];

  if (isContainerReflection(reflection)) {
    for (const child of reflection?.children ?? []) {
      items.push(child);
    }
  }

  for (const property of Object.values(reflection)) {
    if (Array.isArray(property) && property.length > 0 && "id" in property[0]) {
      items.push(...property);
    }
  }

  return items;
};

export const updateTraversableItems = (
  reflection: JSONOutput.Reflection,
  update: (reflection: JSONOutput.Reflection) => any
) => {
  const copy: JSONOutput.Reflection = { ...reflection };

  if (
    isContainerReflection(copy) &&
    copy.children &&
    copy.children.length > 0
  ) {
    copy.children = copy.children.map(update);
  }

  for (const [key, property] of Object.entries(copy)) {
    if (Array.isArray(property) && property.length > 0 && "id" in property[0]) {
      copy[key] = property.map(update);
    }
  }

  return copy;
};
