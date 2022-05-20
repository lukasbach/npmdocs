import React, { FC } from "react";
import type { JSONOutput } from "typedoc";
import { Markdown } from "../../common/markdown";

import style from "./styles.module.css";

export const Comment: FC<{ comment?: JSONOutput.Comment | string }> = ({
  comment,
}) => {
  if (!comment) {
    return null;
  }
  return (
    <div className={style.description}>
      {typeof comment === "string" ? (
        <Markdown markdown={comment} />
      ) : comment.text || comment.shortText ? (
        <Markdown markdown={comment.text ?? comment.shortText} />
      ) : undefined}
    </div>
  );
};
