import * as React from "react";
import { DocsContainer } from "./page-pieces/docs-container";
import { SymbolTitle } from "./page-pieces/symbol-title";
import { useDocs } from "./provider/use-docs";
import { SymbolGroup } from "./page-pieces/symbol-group";
import { isContainerReflection } from "../../common/guards";
export const DocsPage: React.FC = props => {
  const { symbolDocs } = useDocs();

  return (
    <DocsContainer>
      <SymbolTitle />

      {isContainerReflection(symbolDocs) &&
        symbolDocs.groups.map(group => (
          <SymbolGroup group={group} key={group.title} />
        ))}

      <pre>{JSON.stringify(symbolDocs, null, 2)}</pre>
    </DocsContainer>
  );
};
