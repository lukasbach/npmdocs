import React, { FC } from "react";
import type { JSONOutput } from "typedoc";
import { Signature } from "./signature";

import style from "./signature.module.css";
import { hasSignatures, isReflection } from "../../../common/guards";

export const SignatureBlock: FC<{
  item: JSONOutput.DeclarationReflection | JSONOutput.SomeType;
  selectedSignature?: number;
  setSelectedSignature?: (signatureIndex: number) => void;
}> = ({ item, selectedSignature, setSelectedSignature }) => {
  const signatures = hasSignatures(item) ? item.signatures : [item];

  return (
    <ul className={style.signatureBlockList}>
      {signatures.map((signature, index) => (
        <button key={signature.id} className={style.signatureBlockListButton}>
          <li
            className={[
              style.signatureBlockListItem,
              (selectedSignature === index ||
                selectedSignature === undefined) &&
                style.signatureBlockListItemSelected,
            ].join(" ")}
            onClick={() => setSelectedSignature?.(index)}
          >
            {isReflection(item) && `${item.name}: `}
            <Signature type={signature} />
          </li>
        </button>
      ))}
    </ul>
  );
};
