import React, { FC, ReactNode, useState } from "react";
import {
  isTsEnumMember,
  isTsProperty,
  isTsSignature,
  ITsDocBase,
} from "@documentalist/client/lib/typescript";
import {
  IoChevronDownCircleSharp,
  IoChevronForwardCircleSharp,
} from "react-icons/io5";
import { isTsMethod } from "@documentalist/client";
import { Comment } from "./comment";
import { SignatureDeprecated } from "./signatureDeprecated";

import style from "./item.module.css";
import generalStyle from "./styles.module.css";
import { useSymbolDocs } from "../use-symbol-docs";

export const SymbolItemDeprecated: FC<{ child: ITsDocBase }> = ({ child }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const symbolDocs = useSymbolDocs();
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
        <div className={style.name}>{child.name}:</div>
        <SignatureDeprecated item={child} />
      </div>

      {isExpanded && (
        <div className={style.body}>
          {!isTsMethod(child) && (
            <pre className={generalStyle.codeblock}>
              {child.name}: <SignatureDeprecated item={child} />
            </pre>
          )}
          {/*<Comment
            block={
              child.documentation ??
              (isTsMethod(symbolDocs)
                ? symbolDocs.signatures[0].documentation
                : undefined)
            }
          />
          {isTsMethod(child) &&
            child.signatures.map(signature => (
              <div key={signature.name}>
                <pre className={generalStyle.codeblock}>
                  <SignatureDeprecated item={signature} />
                </pre>
                <Comment block={signature.documentation} />
              </div>
            ))}*/}
        </div>
      )}
    </div>
  );
};
