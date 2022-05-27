import React, { FC } from "react";
import { SettingsField } from "./settings-field";
import { Hotkey } from "./hotkey";

export const HotkeysTab: FC = () => {
  return (
    <>
      <SettingsField label="Search symbols">
        <Hotkey keys={["."]} />
      </SettingsField>
    </>
  );
};
