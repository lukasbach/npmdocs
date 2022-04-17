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
import { DocumentationDescription } from "./documentation-description";
import { Signature } from "./signature";

import style from "./item.module.css";
import generalStyle from "./styles.module.css";
import { useSymbolDocs } from "../use-symbol-docs";

export const SymbolItem: FC<{ child: ITsDocBase }> = ({ child }) => {
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
        <Signature item={child} />
      </div>

      {isExpanded && (
        <div className={style.body}>
          {!isTsMethod(child) && (
            <pre className={generalStyle.codeblock}>
              {child.name}: <Signature item={child} />
            </pre>
          )}
          <DocumentationDescription
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
                  <Signature item={signature} />
                </pre>
                <DocumentationDescription block={signature.documentation} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
