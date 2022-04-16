import * as React from "react";
import { ReactNode } from "react";

import style from "./styles.module.css";

export const HeaderListButton: React.FC<{
  children: ReactNode;
  href?: string;
}> = props => {
  return (
    <a href={props.href ?? "#"} className={style.headerListBtn}>
      {props.children}
    </a>
  );
};
