import type { JSONOutput } from "typedoc";

export const getTraversableItems = (reflection: JSONOutput.Reflection) => {
  const items: JSONOutput.Reflection[] = [];

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

  for (const [key, property] of Object.entries(copy)) {
    if (Array.isArray(property) && property.length > 0 && "id" in property[0]) {
      copy[key] = property.map(update);
    }
  }

  return copy;
};
