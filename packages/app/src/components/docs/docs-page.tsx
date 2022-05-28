import * as React from "react";
import { DocsContainer } from "./page-pieces/docs-container";
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
import { SymbolHeader } from "./page-pieces/symbol-header/symbol-header";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";

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
      <Tabs>
        <SymbolHeader />

        <TabPanels>
          <TabPanel>
            <Comment comment={symbolDocs.comment} />

            {isContainerReflection(symbolDocs) &&
              symbolDocs.groups.map(group => (
                <SymbolGroup group={group} key={group.title} />
              ))}

            {isFunction(symbolDocs) && <SymbolItem item={symbolDocs} />}
            {isTypeAlias(symbolDocs) && (
              <SignatureBlock item={symbolDocs.type} />
            )}
          </TabPanel>

          <TabPanel>
            <pre>{JSON.stringify(symbolDocs, null, 2)}</pre>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </DocsContainer>
  );
};
