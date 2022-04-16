import * as React from "react";
import { HeaderButton } from "./header-button";
import { IoSunny, IoMoon } from "react-icons/io5";
import { useEffect, useState } from "react";

export const ColormodeButton: React.FC<{}> = props => {
  const [mode, setMode] = useState("light");
  const isLight = mode === "light";

  useEffect(() => {
    setMode(window.localStorage.getItem("mode") ?? "light");
  }, []);

  return (
    <HeaderButton
      text={
        <>
          {isLight ? <IoSunny /> : <IoMoon />}
          {isLight ? "Light Mode" : "Dark Mode"}
        </>
      }
      onClick={() => {
        const newMode = isLight ? "dark" : "light";
        document.body.classList.remove(mode);
        document.body.classList.add(newMode);
        window.localStorage.setItem("mode", newMode);
        setMode(newMode);
      }}
    />
  );
};
