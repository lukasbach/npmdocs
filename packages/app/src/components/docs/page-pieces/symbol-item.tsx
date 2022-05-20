import React, { memo, useState } from "react";
import type { JSONOutput } from "typedoc";

import {
  IoChevronDownCircleSharp,
  IoChevronForwardCircleSharp,
} from "react-icons/io5";
import { Comment } from "./comment";
import { Signature } from "./signature";
import { SignatureBlock } from "./signature-block";
import { ReflectionKind } from "../../../common/reflection-kind";
import { SymbolItemPiecelist } from "./symbol-item-piecelist";
import {
  isCallSignature,
  isConstructor,
  isConstructorSignature,
  isMethod,
} from "../../../common/guards";
import { SymbolItemPiece } from "./symbol-item-piece";

import style from "./item.module.css";

interface Props {
  item: JSONOutput.DeclarationReflection;
}

export const SymbolItem = memo(function SymbolItem({ item }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState(0);
  const selectedType =
    isMethod(item) || isConstructor(item)
      ? item.signatures[selectedSignature]
      : item;

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
          <SignatureBlock
            item={item}
            selectedSignature={selectedSignature}
            setSelectedSignature={setSelectedSignature}
          />
          <Comment comment={selectedType.comment ?? item.comment} />
          <SymbolItemPiecelist
            pieceReflections={selectedType.typeParameter}
            title="Type Parameters"
          />

          {((t: any): t is JSONOutput.SignatureReflection => true)(
            selectedType
          ) && (
            <>
              <SymbolItemPiecelist
                title="Parameters"
                pieceReflections={selectedType.parameters}
              />
              <SymbolItemPiece
                title="Return Type"
                pieceReflection={
                  isCallSignature(selectedType) ||
                  isConstructorSignature(selectedType)
                    ? selectedType.type
                    : undefined
                }
                comment={selectedType.comment?.returns}
                standalone={true}
              />
            </>
          )}

          {((t: any): t is JSONOutput.ReferenceReflection => true)(
            selectedType
          ) && (
            <>
              <SymbolItemPiecelist
                pieceReflections={selectedType.extendedTypes}
                title="Extends"
              />
              <SymbolItemPiecelist
                pieceReflections={selectedType.implementedBy}
                title="Implemented By"
              />
              <SymbolItemPiecelist
                pieceReflections={selectedType.decorates}
                title="Decorates"
              />

              <div className={style.details}>
                {selectedType.overwrites && (
                  <p className={style.detailLine}>
                    Overwrites <Signature type={selectedType.overwrites} />
                  </p>
                )}

                {selectedType.implementationOf && (
                  <p className={style.detailLine}>
                    Implementation of{" "}
                    <Signature type={selectedType.implementationOf} />
                  </p>
                )}

                {selectedType.inheritedFrom && (
                  <p className={style.detailLine}>
                    Inherited from{" "}
                    <Signature type={selectedType.inheritedFrom} />
                  </p>
                )}

                {selectedType.sources?.[0] && (
                  <p className={style.detailLine}>
                    Defined in {selectedType.sources?.[0]?.fileName}:
                    {selectedType.sources?.[0]?.line}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
});
