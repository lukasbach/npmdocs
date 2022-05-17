import React, { FC, ReactNode } from "react";

import style from "./styles.module.css";
import { ITypescriptPluginData } from "@documentalist/client";
import { Typeguard } from "../../../api/api-helpers";
import { useSymbolDocs } from "../use-symbol-docs";
import { AnyDocsSymbolChild } from "../../../common/types";
import { SymbolItemDeprecated } from "./symbol-item-deprecated";
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
        <SymbolItemDeprecated
          child={item}
          key={item.name + getSignature(item)}
        />
      ))}
    </>
  );
};
