import { useDebounce } from "react-use";
import { useState } from "react";
import { useDocs } from "../docs/provider/use-docs";
import { isProject } from "../../common/guards";

export const useSearchResults = (search: string) => {
  const { lookupMap } = useDocs();
  const [results, setResults] = useState<number[]>([]);
  useDebounce(
    () => {
      // if (!search.length) {
      //   setResults([]);
      //   return;
      // }

      const items: number[] = [];

      for (const [_, item] of lookupMap) {
        if (
          item.reflection.name.length > 0 &&
          item.reflection.name.toLowerCase().includes(search.toLowerCase()) &&
          !isProject(item.reflection)
        ) {
          items.push(item.reflection.id);
        }

        if (items.length >= 20) {
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
