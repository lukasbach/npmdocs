import React, { FC } from "react";
import { SettingsField } from "./settings-field";
import { Hotkey } from "./hotkey";
import { IoArrowDown, IoArrowUp, IoReturnDownBackSharp } from "react-icons/io5";

export const HotkeysTab: FC = () => {
  return (
    <>
      <SettingsField label="Search symbols">
        <Hotkey keys={["."]} /> or <Hotkey keys={["S"]} />
      </SettingsField>
      <SettingsField label="Move up in search results">
        <Hotkey keys={[<IoArrowUp key={0} />]} />
      </SettingsField>
      <SettingsField label="Move down in search results">
        <Hotkey keys={[<IoArrowDown key={0} />]} />
      </SettingsField>
      <SettingsField label="Go to active search result">
        <Hotkey keys={[<IoReturnDownBackSharp key={0} />]} />
      </SettingsField>
      <SettingsField label="Expand all symbols">
        <Hotkey keys={["+"]} />
      </SettingsField>
      <SettingsField label="Collapse all symbols">
        <Hotkey keys={["-"]} />
      </SettingsField>
      <SettingsField label="Select documentation tab">
        <Hotkey keys={["1"]} /> - <Hotkey keys={["5"]} />
      </SettingsField>
    </>
  );
};
