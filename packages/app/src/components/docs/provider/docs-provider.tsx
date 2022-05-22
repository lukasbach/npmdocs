import React, { FC, PropsWithChildren } from "react";
import { DocsContext } from "./context";
import { useConstructDocs } from "./use-construct-docs";
import { Search } from "../../search/search";

export const DocsProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const docs = useConstructDocs();

  if (!docs.docs) {
    return null;
  }

  return (
    <DocsContext.Provider value={docs}>
      {children}
      <Search />
    </DocsContext.Provider>
  );
};
