import React, { FC, ReactNode } from "react";

import style from "./styles.module.css";

export const Loader: FC<{
  title: ReactNode | string;
  subtitle: ReactNode | string;
}> = ({ title, subtitle }) => {
  return (
    <div className={style.loader}>
      <div className={style.title}>{title}</div>
      <div className={style.subtitle}>{subtitle}</div>
    </div>
  );
};
