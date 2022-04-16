import * as React from "react";
import { ReactNode } from "react";

import style from "./styles.module.css";

export const Header: React.FC<{
  children: ReactNode;
}> = props => {
  return <div className={style.header}>{props.children}</div>;
};
