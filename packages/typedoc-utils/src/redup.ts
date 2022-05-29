import { JSONOutput } from "typedoc";
import { constructLookupMap, updateTraversableItems } from ".";

export const redup = (reflection: JSONOutput.Reflection) => {
  const lookup = constructLookupMap(reflection);
  return traverse(reflection, lookup);
};

const traverse = <T>(
  reflection: JSONOutput.Reflection,
  lookup: ReturnType<typeof constructLookupMap>
): T => {
  const newReflection = { ...reflection };

  const withInheritance = redupInheritance(newReflection, lookup);

  const withUpdatedChildren = updateTraversableItems(withInheritance, child =>
    traverse(child, lookup)
  );

  return withUpdatedChildren as any;
};

const redupInheritance = (
  reflection: any | undefined,
  lookup: ReturnType<typeof constructLookupMap>
): JSONOutput.Reflection => {
  if (!reflection?.dedupedInheritedFrom) {
    return reflection;
  }

  const source = redupInheritance(
    lookup.get(reflection.dedupedInheritedFrom.id ?? -1)?.reflection,
    lookup
  );

  if (!source) {
    return reflection;
  }

  return {
    ...source,
    ...reflection,
    id: reflection.id,
    inheritedFrom: reflection.dedupedInheritedFrom,
    overwrites: reflection.overwrites,
    dedupedInheritedFrom: undefined,
  } as any;
};
