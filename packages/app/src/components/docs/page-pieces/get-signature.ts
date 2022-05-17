import {
  isTsEnumMember,
  isTsProperty,
  isTsSignature,
  ITsDocBase,
} from "@documentalist/client/lib/typescript";
import { isTsMethod, isTsTypeAlias } from "@documentalist/client";

export const getSignature = (item: ITsDocBase) => {
  return isTsMethod(item)
    ? item.signatures[0]?.type
    : isTsProperty(item)
    ? item.type
    : isTsEnumMember(item)
    ? item.defaultValue
    : isTsSignature(item)
    ? item.type
    : isTsTypeAlias(item)
    ? item.type
    : "Unknown SignatureDeprecated";
};
