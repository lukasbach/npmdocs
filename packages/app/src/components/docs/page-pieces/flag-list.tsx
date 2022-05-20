import React, { FC } from "react";
import type { JSONOutput } from "typedoc";
import { Flag } from "./flag";

import style from "./flag.module.css";

export const FlagList: FC<{
  flags?: JSONOutput.ReflectionFlags;
  inline?: boolean;
}> = ({ flags, inline }) => {
  return (
    flags && (
      <span className={inline ? style.listInline : style.list}>
        <Flag show={flags.hasExportAssignment}>export</Flag>
        <Flag show={flags.isAbstract}>abstract</Flag>
        <Flag show={flags.isConst}>const</Flag>
        <Flag show={flags.isExternal}>external</Flag>
        <Flag show={flags.isOptional}>optional</Flag>
        <Flag show={flags.isPrivate}>private</Flag>
        <Flag show={flags.isProtected}>protected</Flag>
        <Flag show={flags.isPublic}>public</Flag>
        <Flag show={flags.isReadonly}>readonly</Flag>
        <Flag show={flags.isRest}>rest</Flag>
        <Flag show={flags.isStatic}>static</Flag>
      </span>
    )
  );
};
