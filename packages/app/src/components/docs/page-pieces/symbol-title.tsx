import React, { FC, ReactNode } from "react";
import { useSymbolDocs } from "../use-symbol-docs";

import style from "./styles.module.css";
import { useDocs } from "../provider/use-docs";

export const SymbolTitle: FC = () => {
  const { symbolDocs } = useDocs();
  return (
    <h1>
      {symbolDocs?.kindString}{" "}
      <span className={style.titleHeavy}>{symbolDocs?.name}</span>
    </h1>
  );
};
