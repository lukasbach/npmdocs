import React, { FC, ReactNode } from "react";
import type { JSONOutput } from "typedoc";
import { Signature } from "./signature";
import { Comment } from "./comment";
import { isParameter, isReflection } from "../../../common/guards";

import style from "./symbol-item-piece.module.css";

export const SymbolItemPiece: FC<{
  pieceReflection?: JSONOutput.Reflection | JSONOutput.SomeType;
  title?: string;
  comment?: string;
  standalone?: boolean;
}> = ({ pieceReflection, comment, title, standalone }) => {
  const commentToDisplay =
    comment ??
    (isReflection(pieceReflection) ? pieceReflection.comment : undefined);
  return (
    pieceReflection && (
      <>
        <span className={standalone ? style.titleBlock : undefined}>
          <b className={standalone ? style.titleContent : undefined}>
            {title ??
              (isReflection(pieceReflection)
                ? pieceReflection.name
                : undefined)}
            :
          </b>{" "}
          <span className={style.signature}>
            <Signature type={pieceReflection} />
          </span>
        </span>
        {commentToDisplay && (
          <p>
            <Comment comment={commentToDisplay} />
          </p>
        )}
      </>
    )
  );
};
