import * as React from "react";
import { ReactNode } from "react";

import style from "./styles.module.css";

export const SidebarItem: React.FC<{ children: ReactNode }> = props => {
  return <div className={style.sidebarItem}>{props.children}</div>;
};
