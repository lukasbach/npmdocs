import * as React from "react";
import { DocsContainer } from "./page-pieces/docs-container";
import { useDocs } from "./provider/use-docs";
import { SymbolGroup } from "./page-pieces/symbol-group";
import {
  isContainerReflection,
  isFunction,
  isNamespace,
  isProject,
  isTypeAlias,
} from "@lukasbach/npmdocs-typedoc-utils";
import { Comment } from "./page-pieces/comment";
import { SymbolItem } from "./page-pieces/symbol-item";
import { SignatureBlock } from "./page-pieces/signature-block";
import { SymbolHeader } from "./page-pieces/symbol-header/symbol-header";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import { SymbolSource } from "./source/symbol-source";
import { Overview } from "./overview/overview";
import { RawSource } from "./source/raw-source";
import { PackagejsonSource } from "./source/packagejson-source";
import { useEventBus } from "../../common/use-event-bus";
import { useHotKey } from "../../common/useHotKey";
import { Hierarchy } from "./page-pieces/hierarchy";

export const DocsPage: React.FC = props => {
  const { symbolDocs, error, packageName, version } = useDocs();
  const onToggleExpandedItems = useEventBus<boolean>("toggle-expanded-items");

  useHotKey("+", () => onToggleExpandedItems(true));
  useHotKey("-", () => onToggleExpandedItems(false));

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

  const showOverview = isNamespace(symbolDocs) || isProject(symbolDocs);

  return (
    <DocsContainer>
      <Tabs>
        <SymbolHeader />

        <TabPanels>
          <TabPanel key="docs">
            {showOverview ? (
              <Overview />
            ) : (
              <>
                <Comment comment={symbolDocs.comment} />

                {isContainerReflection(symbolDocs) &&
                  symbolDocs.groups.map(group => (
                    <SymbolGroup group={group} key={group.title} />
                  ))}

                {isFunction(symbolDocs) && <SymbolItem item={symbolDocs} />}

                {isTypeAlias(symbolDocs) && (
                  <>
                    <SignatureBlock item={symbolDocs.type} />
                    {isContainerReflection(
                      (symbolDocs as any).type?.declaration
                    ) &&
                      (symbolDocs as any).type.declaration.groups.map(group => (
                        <SymbolGroup
                          group={group}
                          docsRoot={(symbolDocs as any).type.declaration}
                          key={group.title}
                        />
                      ))}
                  </>
                )}
              </>
            )}
          </TabPanel>

          {/*<TabPanel>
            <Hierarchy />
          </TabPanel>*/}

          <TabPanel>
            <RawSource tabIndex={1} />
          </TabPanel>

          <TabPanel>
            <SymbolSource tabIndex={2} />
          </TabPanel>

          <TabPanel key="overview">
            <PackagejsonSource tabIndex={3} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </DocsContainer>
  );
};
