import * as React from "react";
import { ReactNode } from "react";

import style from "./styles.module.css";

export const LayoutContainer: React.FC<{
  children: ReactNode;
  header: ReactNode;
  sidebar?: ReactNode;
}> = props => {
  return (
    <div className={style.container}>
      <div className={style.header}>{props.header}</div>
      <div className={style.sidebarContentContainer}>
        {props.sidebar && <div className={style.sidebar}>{props.sidebar}</div>}
        <div className={style.content}>{props.children}</div>
      </div>
    </div>
  );
};
