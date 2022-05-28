import { useDebounce } from "react-use";
import { useState } from "react";
import { useDocs } from "../docs/provider/use-docs";
import { isProject } from "../../common/guards";
import { useSettings } from "../settings/use-settings";
import { ReflectionKind } from "../../common/reflection-kind";

const childrenKinds = [
  ReflectionKind.EnumMember,
  ReflectionKind.Constructor,
  ReflectionKind.Property,
  ReflectionKind.Method,
  ReflectionKind.CallSignature,
  ReflectionKind.IndexSignature,
  ReflectionKind.ConstructorSignature,
  ReflectionKind.Parameter,
  ReflectionKind.TypeLiteral,
  ReflectionKind.TypeParameter,
  ReflectionKind.Accessor,
  ReflectionKind.GetSignature,
  ReflectionKind.SetSignature,
  ReflectionKind.ObjectLiteral,
];

export const useSearchResults = (search: string) => {
  const { lookupMap, error } = useDocs();
  const [results, setResults] = useState<number[]>([]);
  const { searchCheckCase, searchOmitChildren, searchListCount } =
    useSettings();
  useDebounce(
    () => {
      // if (!search.length) {
      //   setResults([]);
      //   return;
      // }

      if (error) {
        return;
      }

      const items: number[] = [];

      const searchCased = searchCheckCase ? search : search.toLowerCase();

      for (const [_, item] of lookupMap) {
        const reflectionNameCased = searchCheckCase
          ? item.reflection.name
          : item.reflection.name.toLowerCase();

        const omitBecauseIsChild =
          searchOmitChildren && childrenKinds.includes(item.reflection.kind);

        if (
          item.reflection.name.length > 0 &&
          reflectionNameCased.includes(searchCased) &&
          !omitBecauseIsChild &&
          !isProject(item.reflection)
        ) {
          items.push(item.reflection.id);
        }

        if (items.length >= searchListCount) {
          break;
        }
      }
      setResults(items);
    },
    250,
    [search]
  );
  return results;
};
