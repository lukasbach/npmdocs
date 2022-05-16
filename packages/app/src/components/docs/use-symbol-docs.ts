import { useHash } from "../../common/use-hash";
import { useDocsDeprecated } from "./use-docs-deprecated";

export const useSymbolDocs = () => {
  const symbol = useHash();
  const docs = useDocsDeprecated();
  return docs?.[symbol];
};
