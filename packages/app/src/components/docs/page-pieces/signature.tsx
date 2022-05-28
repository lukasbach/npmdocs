import Link from "next/link";
import React, { FC, memo, ReactNode } from "react";
import type { JSONOutput } from "typedoc";
import { useDocs } from "../provider/use-docs";
import { ReflectionKind } from "../../../common/reflection-kind";
import {
  isContainerReflection,
  isTypeParameter,
} from "@lukasbach/npmdocs-typedoc-utils";

import style from "./signature.module.css";
import { useLookedUpItem } from "../../../common/use-looked-up-item";

interface Props {
  type?:
    | JSONOutput.SomeType
    | JSONOutput.MappedType
    | JSONOutput.TemplateLiteralType
    | JSONOutput.NamedTupleMemberType
    | JSONOutput.DeclarationReflection
    | JSONOutput.TypeParameterReflection;
  reference?: JSONOutput.ReferenceType;
}

const LinkTo: FC<{ name: string }> = ({ name }) => {
  const { getRouteInNamespace } = useDocs();
  return (
    <Link href={getRouteInNamespace(name)}>
      <a className={style.link} onClick={e => e.stopPropagation()}>
        {name}
      </a>
    </Link>
  );
};

const joinComponents = (
  components: ReactNode[] | undefined,
  joiner: string
) => (
  <>
    {components?.map((component, index, array) => (
      <React.Fragment key={index}>
        {component}
        {index !== array.length - 1 && joiner}
      </React.Fragment>
    ))}
  </>
);

export const Signature = memo(function Signature({ type, reference }: Props) {
  const typeAttachedReference = useLookedUpItem((type as any)?.id);

  if (!type) {
    return null;
  }

  if ((type as JSONOutput.Reflection).kind !== undefined) {
    return (
      <ReflectionSignature
        type={type as JSONOutput.Reflection}
        reference={reference}
      />
    );
  }

  if (typeof type.type !== "string") {
    return <Signature type={type.type} reference={reference} />;
  }

  switch (type.type) {
    case "array":
      return (
        <>
          <Signature type={type.elementType} />
          []
        </>
      );
    case "conditional":
      return (
        <>
          <Signature type={type.checkType} />
          {type.extendsType && (
            <>
              {" "}
              extends <Signature type={type.extendsType} />{" "}
            </>
          )}
          ? <Signature type={type.trueType} />
          : <Signature type={type.falseType} />
        </>
      );
    case "indexedAccess":
      return (
        <>
          <Signature type={type.objectType} />[
          <Signature type={type.indexType} />]
        </>
      );
    case "inferred":
      return (
        <>
          infer <LinkTo name={type.name} />
        </>
      );
    case "intersection":
      return joinComponents(
        type.types.map((t, i, a) => <Signature key={i} type={t} />),
        " & "
      );
    case "union":
      return joinComponents(
        type.types.map((t, i, a) => <Signature key={i} type={t} />),
        " | "
      );
    case "intrinsic":
      return <>{type.name}</>;
    case "literal":
      return typeof type.value === "string" ? (
        <>&quot;{type.value}&quot;</>
      ) : (
        // <>{type.value?.toString()}</>
        <>TODO</>
      );
    case "optional":
      return (
        <>
          <Signature type={type.elementType} />?
        </>
      );
    case "predicate":
      return type.asserts ? (
        <>
          asserts <Signature type={type.targetType} />?
        </>
      ) : (
        <>
          {type.name} is <Signature type={type.targetType} />?
        </>
      );
    case "query":
      return (
        <>
          typeof <Signature type={type.queryType} />
        </>
      );
    case "reference": {
      if (type.id) {
        // TODO
        return typeAttachedReference?.reflection ? (
          <Signature type={typeAttachedReference.reflection} reference={type} />
        ) : (
          <>{type.qualifiedName ?? type.name}</>
        );
      }

      return (
        <DeclarationReflectionSignature type={type as any} reference={type} />
      );
    }
    case "reflection":
      return <ReflectionSignature type={type.declaration} />;
    case "rest":
      return (
        <>
          ...
          <Signature type={type.elementType} />
        </>
      );
    case "tuple":
      return (
        <>
          [
          {joinComponents(
            type.elements.map((t, i, a) => <Signature key={i} type={t} />),
            ", "
          )}
          ]
        </>
      );
    case "typeOperator":
      return (
        <>
          {type.operator} <Signature type={type.target} />
        </>
      );
    case "unknown":
      return <>{type.name}</>;
    case "mapped":
      return (
        <>
          {"{"}
          {type.readonlyModifier && `${type.readonlyModifier}readonly `}[$
          {type.parameter} in <Signature type={type.parameterType} />]
          {type.templateType.type === "optional" && "?"}:{" "}
          {type.optionalModifier}
          {type.templateType.type === "optional" ? (
            <Signature type={type.templateType.elementType} />
          ) : (
            <Signature type={type.templateType} />
          )}
          {"}"}
        </>
      );
    case "template-literal":
      return (
        <>
          {"`"}
          {type.head}
          {type.tail.map(([subtype, str], i) => (
            <>
              {"${"}
              <Signature key={i} type={subtype} />
              {"}"}
              {str}
            </>
          ))}
          {"`"}
        </>
      );
    case "named-tuple-member":
      // TODO
      return <>unknown*</>;
  }
});

const ReflectionSignature = memo(function ReflectionSignature({
  type,
  reference,
}: {
  type: JSONOutput.Reflection;
  reference?: JSONOutput.ReferenceType;
}) {
  switch (type.kind) {
    case ReflectionKind.Interface:
    case ReflectionKind.Class:
    case ReflectionKind.EnumMember:
    case ReflectionKind.Method:
    case ReflectionKind.TypeParameter:
    case ReflectionKind.Parameter:
    case ReflectionKind.Property:
    case ReflectionKind.Enum:
    case ReflectionKind.TypeAlias:
    case ReflectionKind.Constructor:
    case ReflectionKind.Function:
      return (
        <DeclarationReflectionSignature type={type} reference={reference} />
      );

    case ReflectionKind.CallSignature:
    case ReflectionKind.ConstructorSignature:
    case ReflectionKind.SetSignature:
    case ReflectionKind.GetSignature:
      return <SignatureReflectionSignature type={type} reference={reference} />;

    case ReflectionKind.Project:
    case ReflectionKind.Module:
    case ReflectionKind.Namespace:
    case ReflectionKind.Variable:
    case ReflectionKind.IndexSignature:
    case ReflectionKind.TypeLiteral:
    case ReflectionKind.Accessor:
    case ReflectionKind.ObjectLiteral:
    case ReflectionKind.Event:
    case ReflectionKind.Reference:
      return <>unkown*</>;
  }
  return null;
});

const DeclarationReflectionSignature = memo(
  function DeclarationReflectionSignature({
    type,
    reference,
  }: {
    type: JSONOutput.DeclarationReflection;
    reference?: JSONOutput.ReferenceType;
  }) {
    switch (type.kind) {
      case ReflectionKind.EnumMember:
        return <>{type.defaultValue}</>;

      case ReflectionKind.Method:
      case ReflectionKind.Constructor:
      case ReflectionKind.Function:
        return (
          <ReflectionSignature
            type={type.signatures[0]}
            reference={reference}
          />
        );

      case ReflectionKind.TypeParameter:
        return (
          <>
            {type.name}
            {isTypeParameter(type) && type.type && (
              <>
                {" extends "}
                <Signature type={type.type} />
              </>
            )}
            {isTypeParameter(type) && type.default && (
              <>
                {" = "}
                <Signature type={type.default} />
              </>
            )}
          </>
        );

      case ReflectionKind.Parameter:
        return (
          <>
            {type.name}: <Signature type={type.type} />
          </>
        );

      case ReflectionKind.Property:
        return <Signature type={type.type} />;

      case ReflectionKind.Interface:
      case ReflectionKind.Class:
      case ReflectionKind.Enum:
      case ReflectionKind.TypeAlias:
      default:
        return (
          <>
            <LinkTo name={type.name} />
            {reference?.typeArguments && (
              <>
                {"<"}
                {joinComponents(
                  reference.typeArguments.map((arg, index) => (
                    <Signature type={arg} key={index} />
                  )),
                  ", "
                )}
                {">"}
              </>
            )}
          </>
        );
    }
  }
);

const SignatureReflectionSignature = memo(
  function SignatureReflectionSignature({
    type,
    reference,
  }: {
    type: JSONOutput.SignatureReflection;
    reference?: JSONOutput.ReferenceType;
  }) {
    switch (type.kind) {
      case ReflectionKind.CallSignature:
      case ReflectionKind.ConstructorSignature:
      case ReflectionKind.SetSignature:
      case ReflectionKind.GetSignature:
        return (
          <>
            {type.typeParameter && (
              <>
                {"<"}
                {joinComponents(
                  type.typeParameter.map(param => (
                    <ReflectionSignature key={param.id} type={param} />
                  )),
                  ", "
                )}
                {">"}
              </>
            )}
            (
            {joinComponents(
              type.parameters?.map(param => (
                <ReflectionSignature key={param.id} type={param} />
              )),
              ", "
            )}
            ){" => "}
            <Signature type={type.type} />
          </>
        );

      default:
        return null;
    }
  }
);
