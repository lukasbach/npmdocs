import React, { FC, ReactNode, useRef } from "react";
import { useDocs } from "../../provider/use-docs";
import { FlagList } from "../flag-list";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";

import style from "./styles.module.css";
import {
  isDeclarationReflection,
  isProject,
  ReflectionKind,
} from "@lukasbach/npmdocs-typedoc-utils";
import { RelatedTypeList } from "./related-type-list.ts";
import { Signature } from "../signature";
import { TabButtons } from "./tab-buttons";
import { useHotKey } from "../../../../common/useHotKey";

export const SymbolHeader: FC = () => {
  const { symbolDocs } = useDocs();
  const typeParameters = isDeclarationReflection(symbolDocs) &&
    symbolDocs.typeParameter && (
      <span className={style.titleThin}>
        {"<"}
        {symbolDocs.typeParameter.map((t, i, arr) => (
          <React.Fragment key={i}>
            <Signature type={t} />
            {i < arr.length - 1 && ", "}
          </React.Fragment>
        ))}
        {">"}
      </span>
    );

  const tabListRef = useRef<HTMLDivElement>(null);
  useHotKey("1", () => tabListRef.current?.children.item(0)?.click());
  useHotKey("2", () => tabListRef.current?.children.item(1)?.click());
  useHotKey("3", () => tabListRef.current?.children.item(2)?.click());
  useHotKey("4", () => tabListRef.current?.children.item(3)?.click());
  useHotKey("5", () => tabListRef.current?.children.item(4)?.click());

  return (
    <div>
      <h1 className={style.title}>
        {symbolDocs?.kind && ReflectionKind[symbolDocs.kind]}{" "}
        <span className={style.titleHeavy}>{symbolDocs?.name}</span>
        {typeParameters}
        <FlagList flags={symbolDocs.flags} />
      </h1>

      {isDeclarationReflection(symbolDocs) && (
        <>
          {typeParameters && (
            <div className={style.typeList}>
              <span className={style.typeListTitle}>typed with</span>{" "}
              {typeParameters}
            </div>
          )}
          <RelatedTypeList types={symbolDocs.extendedTypes}>
            extends
          </RelatedTypeList>
          <RelatedTypeList types={symbolDocs.implementedTypes}>
            implements
          </RelatedTypeList>
          <RelatedTypeList
            types={symbolDocs.inheritedFrom ? [symbolDocs.inheritedFrom] : []}
          >
            inherited from
          </RelatedTypeList>
          <RelatedTypeList types={symbolDocs.extendedBy}>
            extended by
          </RelatedTypeList>
          <RelatedTypeList types={symbolDocs.implementedBy}>
            implemented by
          </RelatedTypeList>
          <RelatedTypeList
            types={
              symbolDocs.implementationOf ? [symbolDocs.implementationOf] : []
            }
          >
            implementation of
          </RelatedTypeList>
        </>
      )}

      {isDeclarationReflection(symbolDocs) && symbolDocs.sources && (
        <div className={style.typeList}>
          <span className={style.typeListTitle}>implemented in</span>{" "}
          {symbolDocs.sources?.[0]?.fileName}:{symbolDocs.sources?.[0]?.line}
        </div>
      )}

      <TabList
        className={style.tabs}
        key={`docstabs-${isProject(symbolDocs) ? "project" : "symbol"}`} // re-render tabs when switching between project and symbol
        ref={tabListRef}
      >
        <Tab>Docs</Tab>
        <Tab>Hierarchy</Tab>
        <Tab>Raw</Tab>
        <Tab>Source</Tab>
        {isProject(symbolDocs) ? <Tab>package.json</Tab> : null}
        <div className={style.tabsStretcher} />
        <TabButtons key={symbolDocs?.name} />
      </TabList>
    </div>
  );
};
