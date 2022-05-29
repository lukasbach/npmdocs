import React, { FC, ReactNode } from "react";
import { SettingsField } from "./settings-field";
import { BooleanSetting } from "./boolean-setting";
import { NumberSetting } from "./number-setting";

export const SearchTab: FC = () => {
  return (
    <>
      <SettingsField label="Omit children like parameters or methods">
        <BooleanSetting setting="searchOmitChildren" />
      </SettingsField>
      <SettingsField label="Check Case">
        <BooleanSetting setting="searchCheckCase" />
      </SettingsField>
      {/*<SettingsField label="Check full path">
        <BooleanSetting setting="searchCheckFullPath" />
      </SettingsField> TODO */}
      <SettingsField label="Result Limit">
        <NumberSetting setting="searchListCount" />
      </SettingsField>
    </>
  );
};
