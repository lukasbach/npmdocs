import { JSONOutput } from "typedoc";
import deepEqual from "fast-deep-equal";
import { constructLookupMap, hasInheritance, updateTraversableItems } from ".";

export const dedup = (reflection: JSONOutput.Reflection) => {
  const lookup = constructLookupMap(reflection);
  return traverse(reflection, lookup);
};

const traverse = <T>(
  reflection: JSONOutput.Reflection,
  lookup: ReturnType<typeof constructLookupMap>
): T => {
  const newReflection = { ...reflection };

  if (newReflection.kindString !== undefined) {
    newReflection.kindString = undefined;
  }

  const withPurgedInheritance = purgeInheritance(newReflection, lookup);

  const withUpdatedChildren = updateTraversableItems(
    withPurgedInheritance,
    child => traverse(child, lookup)
  );

  return withUpdatedChildren as any;
};

const purgeInheritance = (
  reflection: JSONOutput.Reflection,
  lookup: ReturnType<typeof constructLookupMap>
): JSONOutput.Reflection => {
  if (!hasInheritance(reflection)) {
    return reflection;
  }

  const source = lookup.get(reflection.inheritedFrom?.id ?? -1);

  if (!source) {
    return reflection;
  }

  const sourceTester = {
    ...source.reflection,
    id: undefined,
    inheritedFrom: undefined,
    overwrites: undefined,
    kindString: undefined,
  };
  const reflectionTester = {
    ...reflection,
    id: undefined,
    inheritedFrom: undefined,
    overwrites: undefined,
    kindString: undefined,
  };

  if (!deepEqual(sourceTester, reflectionTester)) {
    return reflection;
  }

  return {
    id: reflection.id,
    dedupedInheritedFrom: reflection.inheritedFrom,
    overwrites: (reflection as any).overwrites,
  } as any;
};
