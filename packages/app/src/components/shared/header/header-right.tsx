import React, { FC } from "react";
import { HeaderButton } from "../../common/header/header-button";
import { PackageSearchInput } from "../../docs/package-search-input";
import { ColormodeButton } from "../../common/header/colormode-button";
import { SettingsButton } from "../../settings/settings-button";

export const HeaderRight: FC = () => {
  return (
    <>
      <PackageSearchInput />
      <HeaderButton text="@lukasbach" />
      <ColormodeButton />
      <SettingsButton>
        {props => <HeaderButton buttonProps={props} text="Settings" />}
      </SettingsButton>
    </>
  );
};
