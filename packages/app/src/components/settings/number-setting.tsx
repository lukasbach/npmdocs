import React, { FC, ReactNode } from "react";

import style from "./styles.module.css";
import { Settings } from "./types";
import { useSettings } from "./use-settings";

export const NumberSetting: FC<{ setting: keyof Settings }> = ({ setting }) => {
  const { update, ...settings } = useSettings();
  const value = settings[setting];
  return (
    <input
      type="number"
      value={value as number}
      onChange={e => {
        update({ [setting]: e.target.valueAsNumber });
      }}
      style={{ width: "80px" }}
    />
  );
};
