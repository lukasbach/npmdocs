import * as React from "react";
import { ReactNode } from "react";

import style from "./styles.module.css";

export const Sidebar: React.FC<{ children: ReactNode }> = props => {
  return <div className={style.sidebar}>{props.children}</div>;
};
