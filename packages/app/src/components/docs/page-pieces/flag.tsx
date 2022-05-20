import React, { FC, ReactNode } from "react";

import style from "./flag.module.css";

export const Flag: FC<{ children: ReactNode; show: boolean }> = ({
  children,
  show,
}) => {
  return show && <span className={style.flag}>{children}</span>;
};
