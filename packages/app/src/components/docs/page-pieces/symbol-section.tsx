import React, { FC, ReactNode } from "react";

import style from "./styles.module.css";
import { ITypescriptPluginData } from "@documentalist/client";
import { Typeguard } from "../../../api/api-helpers";
import { useSymbolDocs } from "../use-symbol-docs";
import { AnyDocsSymbolChild } from "../../../common/types";
import { SymbolItem } from "./symbol-item";
import { getSignature } from "./get-signature";

export const SymbolSection: FC<{
  title: string;
  section: keyof AnyDocsSymbolChild;
}> = ({ title, section }) => {
  const symbolDocs = useSymbolDocs();

  if (!symbolDocs || !(symbolDocs as any)[section]?.length) {
    return null;
  }

  return (
    <>
      <h2>{title}</h2>
      {(symbolDocs as any)[section]?.map(item => (
        <SymbolItem child={item} key={item.name + getSignature(item)} />
      ))}
    </>
  );
};
