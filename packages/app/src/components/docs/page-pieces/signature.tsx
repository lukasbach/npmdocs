import Link from "next/link";
import React, { FC, memo, ReactNode } from "react";
import type { JSONOutput } from "typedoc";
import { useDocs } from "../provider/use-docs";
import { ReflectionKind } from "../../../common/reflection-kind";

import style from "./signature.module.css";

interface Props {
  type?:
    | JSONOutput.SomeType
    | JSONOutput.MappedType
    | JSONOutput.TemplateLiteralType
    | JSONOutput.NamedTupleMemberType
    | JSONOutput.DeclarationReflection;
  reference?: JSONOutput.ReferenceType;
}

const LinkTo: FC<{ name: string }> = ({ name }) => {
  const { getRouteInNamespace } = useDocs();
  return (
    <Link href={getRouteInNamespace(name)}>
      <a className={style.link}>{name}</a>
    </Link>
  );
};

const joinComponents = (components: ReactNode[], joiner: string) => (
  <>
    {components.map((component, index, array) => (
      <React.Fragment key={index}>
        {component}
        {index !== array.length - 1 && joiner}
      </React.Fragment>
    ))}
  </>
);

export const Signature = memo(function Signature({ type, reference }: Props) {
  const { symbolDocs, moduleDocs, docs } = useDocs();
  console.log((type as any).name, type.type, (type as any).kind);

  if (!type) {
    return null;
  }

  if (!type.type) {
    return (
      <ReflectionSignature
        type={type as JSONOutput.DeclarationReflection}
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
              extends <Signature type={type.extendsType} />
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
        const referencedSymbol =
          symbolDocs.children?.find(s => s.id === type.id) ||
          moduleDocs.children?.find(s => s.id === type.id) ||
          docs.children?.find(s => s.id === type.id);
        return referencedSymbol ? (
          <Signature type={referencedSymbol} reference={type} />
        ) : (
          <>{type.qualifiedName ?? type.name}</>
        );
      }

      return <>{type.qualifiedName ?? type.name}</>;
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
          {type.operator}
          <Signature type={type.target} />
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
          {type.templateType.type === "optional" && "?"}
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
      return <>[TYPE NOT RESOLVED]</>;
  }
});

const ReflectionSignature = memo(function ReflectionSignature({
  type,
  reference,
}: {
  type: JSONOutput.DeclarationReflection;
  reference?: JSONOutput.ReferenceType;
}) {
  switch (type.kind) {
    case ReflectionKind.Interface:
    case ReflectionKind.Class:

    // TODO ?
    case ReflectionKind.Project:
    case ReflectionKind.Module:
    case ReflectionKind.Namespace:
    case ReflectionKind.Enum:
    case ReflectionKind.Variable:
    case ReflectionKind.Function:
    case ReflectionKind.Constructor:
    case ReflectionKind.Property:
    case ReflectionKind.Method:
    case ReflectionKind.CallSignature:
    case ReflectionKind.IndexSignature:
    case ReflectionKind.ConstructorSignature:
    case ReflectionKind.Parameter:
    case ReflectionKind.TypeLiteral:
    case ReflectionKind.TypeParameter:
    case ReflectionKind.Accessor:
    case ReflectionKind.GetSignature:
    case ReflectionKind.SetSignature:
    case ReflectionKind.ObjectLiteral:
    case ReflectionKind.TypeAlias:
    case ReflectionKind.Event:
    case ReflectionKind.Reference:
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

    case ReflectionKind.EnumMember:
      return <>{type.defaultValue}</>;

      return <>[TYPE NOT RESOLVED]</>;
  }
  return null;
});
