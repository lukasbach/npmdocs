import React, { FC } from "react";
import { HeaderButton } from "../../common/header/header-button";
import { PackageSearchInput } from "../../docs/package-search-input";
import { ColormodeButton } from "../../common/header/colormode-button";
import { SettingsButton } from "../../settings/settings-button";
import { IoOptions } from "react-icons/io5";

export const HeaderRight: FC = () => {
  return (
    <>
      <PackageSearchInput />
      <HeaderButton
        text="@lukasbach"
        href="https://github.com/lukasbach"
        isExternal={true}
      />
      <ColormodeButton />
      <SettingsButton>
        {props => (
          <HeaderButton
            buttonProps={props}
            text={
              <>
                Settings <IoOptions />
              </>
            }
          />
        )}
      </SettingsButton>
    </>
  );
};
