import React, { FC, ReactNode } from "react";

import style from "./styles.module.css";

export const Hotkey: FC<{ keys: string[] }> = ({ keys }) => {
  return (
    <>
      {keys.map((key, index, arr) => (
        <React.Fragment key={index}>
          <span className={style.hotkey}>{key}</span>
          {index < arr.length - 1 && (
            <span className={style.hotkeySeparator}>+</span>
          )}
        </React.Fragment>
      ))}
    </>
  );
};
