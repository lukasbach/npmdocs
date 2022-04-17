import * as React from "react";
import { DocsContainer } from "./page-pieces/docs-container";
import { useSymbolDocs } from "./use-symbol-docs";
import { SymbolTitle } from "./page-pieces/symbol-title";
import { SymbolSection } from "./page-pieces/symbol-section";
import { DocumentationDescription } from "./page-pieces/documentation-description";

import style from "./page-pieces/styles.module.css";
import { isTsTypeAlias } from "@documentalist/client";
import { Signature } from "./page-pieces/signature";

export const DocsPage: React.FC = props => {
  const symbolDocs = useSymbolDocs();

  if (!symbolDocs) {
    return null;
  }

  return (
    <DocsContainer>
      <SymbolTitle />
      <DocumentationDescription block={symbolDocs.documentation} />
      <SymbolSection title="Constructors" section="constructorType" />
      <SymbolSection title="Properties" section="properties" />
      <SymbolSection title="Methods" section="methods" />
      <SymbolSection title="Accessors" section="accessors" />
      <SymbolSection title="Members" section="members" />
      <SymbolSection title="Signatures" section="signatures" />

      {isTsTypeAlias(symbolDocs) && (
        <pre className={style.codeblock}>
          {symbolDocs.name} = <Signature item={symbolDocs} />
        </pre>
      )}

      {/*<pre>{JSON.stringify(symbolDocs, null, 2)}</pre>*/}
    </DocsContainer>
  );
};
