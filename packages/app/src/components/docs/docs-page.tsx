import * as React from "react";
import { DocsContainer } from "./page-pieces/docs-container";
import { useSymbolDocs } from "./use-symbol-docs";
import { SymbolTitle } from "./page-pieces/symbol-title";
import { SymbolSection } from "./page-pieces/symbol-section";
import { Comment } from "./page-pieces/comment";

import style from "./page-pieces/styles.module.css";
import { isTsTypeAlias } from "@documentalist/client";
import { SignatureDeprecated } from "./page-pieces/signatureDeprecated";
import { DocsProvider } from "./provider/docs-provider";
import { useDocs } from "./provider/use-docs";
import { SymbolGroup } from "./page-pieces/symbol-group";
export const DocsPage: React.FC = props => {
  const { symbolDocs } = useDocs();

  return (
    <DocsContainer>
      <SymbolTitle />

      {symbolDocs.groups.map(group => (
        <SymbolGroup group={group} key={group.title} />
      ))}

      <pre>{JSON.stringify(symbolDocs, null, 2)}</pre>
    </DocsContainer>
  );
};
