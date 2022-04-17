import * as React from "react";
import { ReactNode } from "react";
import Link from "next/link";

import style from "./styles.module.css";

export const SidebarItem: React.FC<{
  children: ReactNode;
  href?: string;
  selected?: boolean;
}> = props => {
  return (
    <Link href={props.href}>
      <a
        className={`${style.sidebarItem} ${
          props.selected && style.sideBarItemSelected
        }`}
      >
        {props.children}
      </a>
    </Link>
  );
};
