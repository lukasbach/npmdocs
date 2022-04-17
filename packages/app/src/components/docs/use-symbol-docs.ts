import { useHash } from "../../common/use-hash";
import { useDocs } from "./use-docs";

export const useSymbolDocs = () => {
  const symbol = useHash();
  const docs = useDocs();
  return docs?.[symbol];
};
