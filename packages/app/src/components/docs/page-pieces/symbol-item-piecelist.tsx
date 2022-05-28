import React, { FC, ReactNode } from "react";
import type { JSONOutput } from "typedoc";
import { SymbolItemPiece } from "./symbol-item-piece";

import style from "./symbol-item-piece.module.css";
import { isReflection } from "@lukasbach/npmdocs-typedoc-utils";

export const SymbolItemPiecelist: FC<{
  pieceReflections?: Array<JSONOutput.Reflection | JSONOutput.SomeType>;
  title: string;
}> = ({ pieceReflections, title }) => {
  return (
    pieceReflections && (
      <div>
        <h4 className={[style.titleBlock, style.titleContent].join(" ")}>
          {title}
        </h4>
        <ul className={style.list}>
          {pieceReflections.map((reflection, index) => (
            <li key={index}>
              <SymbolItemPiece
                title={isReflection(reflection) ? reflection.name : undefined}
                pieceReflection={(reflection as any).type ?? reflection}
              />
            </li>
          ))}
        </ul>
      </div>
    )
  );
};
