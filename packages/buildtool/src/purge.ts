import { JSONOutput } from "typedoc";
import {
  constructLookupMap,
  hasInheritance,
  isContainerReflection,
  updateTraversableItems,
} from "@lukasbach/npmdocs-typedoc-utils";
import deepEqual from "fast-deep-equal";

export const purge = (reflection: JSONOutput.Reflection) => {
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

  updateTraversableItems(newReflection, child => traverse(child, lookup));

  return purgeInheritance(newReflection, lookup) as any;
};

const purgeInheritance = (
  reflection: JSONOutput.Reflection,
  lookup: ReturnType<typeof constructLookupMap>
) => {
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
    kindString: undefined,
    typeArguments: undefined,
  };
  const reflectionTester = {
    ...reflection,
    id: undefined,
    inheritedFrom: undefined,
    kindString: undefined,
    typeArguments: undefined,
  };

  // console.log(source.reflection.id, reflection.id);
  if (reflection.id === 160 && source.reflection.id === 20) {
    console.log(
      JSON.stringify(sourceTester),
      JSON.stringify(reflectionTester),
      deepEqual(sourceTester, reflectionTester)
    );
  }

  if (!deepEqual(sourceTester, reflectionTester)) {
    return reflection;
  }

  return {
    id: reflection.id,
    inheritedFrom: reflection.inheritedFrom,
    typeArguments: (reflection as any).typeArguments,
  };
};
