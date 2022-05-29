import * as React from "react";
import { HeaderButton } from "./header-button";
import { IoSunny, IoMoon } from "react-icons/io5";
import { useSettings } from "../../settings/use-settings";

export const ColormodeButton: React.FC<{}> = props => {
  const { darkMode, update } = useSettings();
  return (
    <HeaderButton
      text={<>{darkMode ? <IoMoon /> : <IoSunny />}</>}
      onClick={() => update({ darkMode: !darkMode })}
      buttonProps={{
        title: "Toggle dark mode",
      }}
    />
  );
};
