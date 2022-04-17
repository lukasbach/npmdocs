import * as React from "react";
import { ReactNode } from "react";
import Link from "next/link";

import style from "./styles.module.css";

export const SidebarItem: React.FC<{
  children: ReactNode;
  href?: string;
  selected?: boolean;
  onClick?: () => void;
  indent?: number;
}> = props => {
  const anchor = (
    <a
      className={`${style.sidebarItem} ${
        props.selected && style.sideBarItemSelected
      }`}
      onClick={props.onClick}
    >
      {props.indent ? (
        <span
          style={{ width: `${props.indent * 20}px`, display: "inline-block" }}
          aria-hidden="true"
        />
      ) : null}
      {props.children}
    </a>
  );

  if (props.href) {
    return <Link href={props.href}>{anchor}</Link>;
  } else {
    return anchor;
  }
};
