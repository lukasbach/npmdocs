import React, { FC, ReactNode, useMemo } from "react";
import {
  isTsEnumMember,
  isTsProperty,
  isTsSignature,
  ITsDocBase,
} from "@documentalist/client/lib/typescript";
import { isTsMethod } from "@documentalist/client";
import { useDocsDeprecated } from "../use-docs-deprecated";
import { getSignature } from "./get-signature";

import style from "./styles.module.css";

const WORD_SEPARATORS = /([[\]<>() :.,]+)/g;

const escapeHtml = unsafe => {
  return (
    unsafe
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      // eslint-disable-next-line quotes
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;")
  );
};

export const Signature: FC<{ item: ITsDocBase }> = ({ item }) => {
  const docs = useDocsDeprecated();

  const linkedSignature = useMemo(() => {
    const signature = getSignature(item);

    let updatedSignature = "";
    for (const word of signature.split(WORD_SEPARATORS)) {
      if (docs[word]) {
        updatedSignature += `__START__${word}__END__`;
      } else {
        updatedSignature += `${word}`;
      }
    }
    updatedSignature = escapeHtml(updatedSignature);
    updatedSignature = updatedSignature.replace(
      /__START__([^_]+)__END__/g,
      // eslint-disable-next-line prettier/prettier
      "<a href=\"#$1\">$1</a>"
    );

    return updatedSignature;
  }, [docs, item]);

  return (
    <span
      className={style.signature}
      dangerouslySetInnerHTML={{ __html: linkedSignature }}
    />
  );
};
