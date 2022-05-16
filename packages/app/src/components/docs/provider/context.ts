import { createContext } from "react";
import { useConstructDocs } from "./use-construct-docs";

export const DocsContext = createContext<ReturnType<typeof useConstructDocs>>(
  null as any
);
