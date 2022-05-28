import * as React from "react";
import { ReactNode } from "react";

import style from "./styles.module.css";
import { useSettings } from "../../settings/use-settings";

export const DocsContainer: React.FC<{ children: ReactNode }> = props => {
  const { containerWidth } = useSettings();
  return (
    <div
      className={style.container}
      style={{
        width: containerWidth <= 0 ? "100%" : `${containerWidth}px`,
      }}
    >
      {props.children}
    </div>
  );
};
