import React, { FC, ReactNode } from "react";
import type { JSONOutput } from "typedoc";
import { Signature } from "../signature";

import style from "./styles.module.css";

export const RelatedTypeList: FC<{
  children: ReactNode;
  types?: JSONOutput.SomeType[];
}> = ({ children, types }) => {
  if (!types || types.length === 0) {
    return null;
  }
  return (
    <div className={style.typeList}>
      <span className={style.typeListTitle}>{children}</span>{" "}
      {types.map((type, index, array) => (
        <React.Fragment key={index}>
          <Signature type={type} />
          {index !== array.length - 1 && <span>, </span>}
        </React.Fragment>
      ))}
    </div>
  );
};
