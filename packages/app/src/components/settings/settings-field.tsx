import React, { FC, ReactNode } from "react";

import style from "./styles.module.css";

export const SettingsField: FC<{ children: ReactNode; label: string }> = ({
  children,
  label,
}) => {
  return (
    <label className={style.field}>
      <div className={style.fieldLabel}>{label}</div>
      <div className={style.fieldValue}>{children}</div>
    </label>
  );
};
