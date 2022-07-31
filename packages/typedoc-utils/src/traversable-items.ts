import type { JSONOutput } from "typedoc";

export const getTraversableItems = (reflection: JSONOutput.Reflection) => {
  const items: JSONOutput.Reflection[] = [];

  items.push(...getSubPropsWithChildren(reflection));
  for (const property of Object.values(reflection)) {
    items.push(...getSubPropsWithChildren(property));
  }

  return items;
};

const getSubPropsWithChildren = (obj: any) => {
  const items: JSONOutput.Reflection[] = [];

  if (!obj) {
    return [];
  }

  if (Array.isArray(obj) && obj.length > 0 && "id" in obj[0]) {
    items.push(...obj);
  }

  if (obj.type?.declaration?.children) {
    items.push(...obj.type.declaration.children);
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
