import * as React from "react";
import { ReactNode } from "react";

import style from "./styles.module.css";

export const DocsContainer: React.FC<{ children: ReactNode }> = props => {
  return <div className={style.container}>{props.children}</div>;
};
