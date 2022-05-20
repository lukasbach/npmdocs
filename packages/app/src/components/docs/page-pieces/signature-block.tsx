import React, { FC } from "react";
import type { JSONOutput } from "typedoc";
import { ReflectionKind } from "../../../common/reflection-kind";
import { Signature } from "./signature";

import style from "./signature.module.css";

export const SignatureBlock: FC<{
  item: JSONOutput.DeclarationReflection;
  selectedSignature: number;
  setSelectedSignature: (signatureIndex: number) => void;
}> = ({ item, selectedSignature, setSelectedSignature }) => {
  const signatures =
    (item as JSONOutput.Reflection).kind === ReflectionKind.Method
      ? item.signatures
      : [item];

  return (
    <ul className={style.signatureBlockList}>
      {signatures.map((signature, index) => (
        <button key={signature.id} className={style.signatureBlockListButton}>
          <li
            className={[
              style.signatureBlockListItem,
              selectedSignature === index &&
                style.signatureBlockListItemSelected,
            ].join(" ")}
            onClick={() => setSelectedSignature(index)}
          >
            {item.name}: <Signature type={signature} />
          </li>
        </button>
      ))}
    </ul>
  );
};
