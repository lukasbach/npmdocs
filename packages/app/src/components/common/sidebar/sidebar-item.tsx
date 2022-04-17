import * as React from "react";
import { ReactNode } from "react";

import style from "./styles.module.css";

export const SidebarItem: React.FC<{
  children: ReactNode;
  href?: string;
  selected?: boolean;
}> = props => {
  return (
    <a
      href={props.href}
      className={`${style.sidebarItem} ${
        props.selected && style.sideBarItemSelected
      }`}
    >
      {props.children}
    </a>
  );
};
