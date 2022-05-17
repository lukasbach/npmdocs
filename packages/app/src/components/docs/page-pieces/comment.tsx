import React, { FC } from "react";
import type { JSONOutput } from "typedoc";
import { Markdown } from "../../common/markdown";

import style from "./styles.module.css";

export const Comment: FC<{ comment?: JSONOutput.Comment }> = ({ comment }) => {
  if (!comment) {
    return null;
  }
  return (
    <div className={style.description}>
      {(comment.text || comment.shortText) && (
        <Markdown markdown={comment.text ?? comment.shortText} />
      )}
      {comment.returns && (
        <p>
          Returns: <Markdown markdown={comment.returns} />
        </p>
      )}
    </div>
  );
};
