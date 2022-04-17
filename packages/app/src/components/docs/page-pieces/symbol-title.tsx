import React, { FC, ReactNode } from "react";
import { useSymbolDocs } from "../use-symbol-docs";

import style from "./styles.module.css";

export const SymbolTitle: FC = () => {
  const symbolDocs = useSymbolDocs();
  return (
    <h1>
      {symbolDocs?.kind}{" "}
      <span className={style.titleHeavy}>{symbolDocs?.name}</span>
    </h1>
  );
};
