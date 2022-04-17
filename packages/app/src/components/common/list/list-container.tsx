import React, { FC, ReactNode } from "react";

import style from "./styles.module.css";

export const ListContainer: FC<{ children: ReactNode }> = ({ children }) => {
  return <ul className={style.container}>{children}</ul>;
};
