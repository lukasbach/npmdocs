import * as React from "react";
import { ReactNode } from "react";

import style from "./styles.module.css";

export const SidebarHeader: React.FC<{ children: ReactNode }> = props => {
  return <div className={style.sidebarHeader}>{props.children}</div>;
};
