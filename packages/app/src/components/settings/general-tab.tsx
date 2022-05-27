import React, { FC, ReactNode } from "react";
import { SettingsField } from "./settings-field";
import { BooleanSetting } from "./boolean-setting";
import { NumberSetting } from "./number-setting";

export const GeneralTab: FC = () => {
  return (
    <>
      <SettingsField label="Dark Mode">
        <BooleanSetting setting="darkMode" />
      </SettingsField>
      <SettingsField label="Container Width">
        <NumberSetting setting="containerWidth" />
      </SettingsField>
      <SettingsField label="Sort Enums by Value">
        <BooleanSetting setting="sortEnumsByValue" />
      </SettingsField>
      <SettingsField label="Hide inherited members">
        <BooleanSetting setting="hideInheritedMembers" />
      </SettingsField>
      <SettingsField label="Expand accordions by default">
        <BooleanSetting setting="defaultExpandAccordions" />
      </SettingsField>
      <SettingsField label="Hide flags in lists">
        <BooleanSetting setting="hideFlagsInLists" />
      </SettingsField>
    </>
  );
};
