import type { JSONOutput } from "typedoc";
import { useMemo } from "react";
import { constructLookupMap } from "@lukasbach/npmdocs-typedoc-utils";

export const useConstructLookupMap = (reflection?: JSONOutput.Reflection) => {
  return useMemo(() => constructLookupMap(reflection), [reflection]);
};
