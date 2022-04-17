import {
  ITsClass,
  ITsConstructor,
  ITsEnum,
  ITsEnumMember,
  ITsInterface,
  ITsMethod,
  ITsParameter,
  ITsProperty,
  ITsSignature,
  ITsTypeAlias,
} from "@documentalist/client";

export type AnyDocsSymbolChild = ITsClass &
  ITsConstructor &
  ITsEnum &
  ITsEnumMember &
  ITsInterface &
  ITsMethod &
  ITsParameter &
  ITsProperty &
  ITsSignature &
  ITsTypeAlias;
