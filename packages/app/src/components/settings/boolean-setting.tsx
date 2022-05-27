import React, { FC, ReactNode } from "react";

import style from "./styles.module.css";
import { Settings } from "./types";
import { useSettings } from "./use-settings";

export const BooleanSetting: FC<{ setting: keyof Settings }> = ({
  setting,
}) => {
  const { update, ...settings } = useSettings();
  const value = settings[setting];
  return (
    <input
      type="checkbox"
      checked={value as boolean}
      onChange={e => {
        update({ [setting]: e.target.checked });
      }}
    />
  );
};
