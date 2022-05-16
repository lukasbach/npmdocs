import { useContext } from "react";
import { DocsContext } from "./context";

export const useDocs = () => useContext(DocsContext);
