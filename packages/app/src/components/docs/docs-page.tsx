import * as React from "react";
import { DocsContainer } from "./page-pieces/docs-container";
import { SymbolTitle } from "./page-pieces/symbol-title";
import { useDocs } from "./provider/use-docs";
import { SymbolGroup } from "./page-pieces/symbol-group";
import {
  isContainerReflection,
  isFunction,
  isTypeAlias,
} from "../../common/guards";
import { Comment } from "./page-pieces/comment";
import { SymbolItem } from "./page-pieces/symbol-item";
import { SignatureBlock } from "./page-pieces/signature-block";
import { Search } from "../search/search";
import { Loader } from "../loader/loader";

export const DocsPage: React.FC = props => {
  const { symbolDocs, error, packageName, version } = useDocs();

  if (error) {
    return (
      <>
        <DocsContainer>
          <h1>
            Error for package {packageName}@{version}
          </h1>
          Building the documentation for this package failed with the following
          error:
          <p>{error.error}</p>
          <p>{error.details}</p>
        </DocsContainer>
      </>
    );
  }

  return (
    <DocsContainer>
      <SymbolTitle />
      <Comment comment={symbolDocs.comment} />

      {isContainerReflection(symbolDocs) &&
        symbolDocs.groups.map(group => (
          <SymbolGroup group={group} key={group.title} />
        ))}

      {isFunction(symbolDocs) && <SymbolItem item={symbolDocs} />}
      {isTypeAlias(symbolDocs) && <SignatureBlock item={symbolDocs.type} />}

      {/*<pre>{JSON.stringify(symbolDocs, null, 2)}</pre>*/}
    </DocsContainer>
  );
};
