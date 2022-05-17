import React, { memo, useState } from "react";
import type { JSONOutput } from "typedoc";

import {
  IoChevronDownCircleSharp,
  IoChevronForwardCircleSharp,
} from "react-icons/io5";

import style from "./item.module.css";
import generalStyle from "./styles.module.css";
import { Comment } from "./comment";
import { Signature } from "./signature";

interface Props {
  item: JSONOutput.DeclarationReflection;
}

export const SymbolItem = memo(function SymbolItem({ item }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={style.item}>
      <div className={style.head} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={style.chevron}>
          {isExpanded ? (
            <IoChevronDownCircleSharp />
          ) : (
            <IoChevronForwardCircleSharp />
          )}
        </div>
        <div className={style.name}>{item.name}:</div>
        <div className={style.inlineSignature}>
          <Signature type={item} />
        </div>
      </div>

      {isExpanded && (
        <div className={style.body}>
          <Comment comment={item.comment ?? item.signatures?.[0]?.comment} />
        </div>
      )}
    </div>
  );
});
