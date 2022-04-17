import * as React from "react";
import { ReactNode } from "react";

import style from "./styles.module.css";

export const SidebarHeader: React.FC<{
  children: ReactNode;
  as: string;
}> = props => {
  const As = props.as as "h1";
  return <As className={style.sidebarHeader}>{props.children}</As>;
};
