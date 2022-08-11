import Link from "next/link";
import React, {
  createContext,
  FC,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";
import type { JSONOutput } from "typedoc";
import { useDocs } from "../provider/use-docs";
import { ReflectionKind } from "../../../common/reflection-kind";
import { isTypeParameter } from "@lukasbach/npmdocs-typedoc-utils";

import style from "./signature.module.css";
import { useLookedUpItem } from "../../../common/use-looked-up-item";
import { useInterval } from "react-use";

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

const OverflowContext = createContext({
  tracker: { current: {} },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  track: (id: string | number) => {},
});

export const Signature = memo(function Signature({ type, reference }: Props) {
  const tracker = useRef({});
  const track = useCallback((id: string | number) => {
    if (tracker.current[id] === undefined) {
      tracker.current[id] = 0;
    }
    tracker.current[id]++;
  }, []);
  useInterval(() => (tracker.current = {}), 1000);
  return (
    <OverflowContext.Provider value={{ tracker, track }}>
      <WrappedSignature type={type} reference={reference} />
    </OverflowContext.Provider>
  );
});

const WrappedSignature = memo(function WrappedSignature({
  type,
  reference,
}: Props) {
  const { tracker, track } = useContext(OverflowContext);
  if ("id" in type) {
    track(type.id);
    if (tracker.current[type.id] >= 50) {
      return <>...</>;
    }
  }

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
    return <WrappedSignature type={type.type} reference={reference} />;
  }

  switch (type.type) {
    case "array":
      return (
        <>
          <WrappedSignature type={type.elementType} />
          []
        </>
      );
    case "conditional":
      return (
        <>
          <WrappedSignature type={type.checkType} />
          {type.extendsType && (
            <>
              {" "}
              extends <WrappedSignature type={type.extendsType} />{" "}
            </>
          )}
          ? <WrappedSignature type={type.trueType} />
          : <WrappedSignature type={type.falseType} />
        </>
      );
    case "indexedAccess":
      return (
        <>
          <WrappedSignature type={type.objectType} />[
          <WrappedSignature type={type.indexType} />]
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
        type.types.map((t, i, a) => <WrappedSignature key={i} type={t} />),
        " & "
      );
    case "union":
      return joinComponents(
        type.types.map((t, i, a) => <WrappedSignature key={i} type={t} />),
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
          <WrappedSignature type={type.elementType} />?
        </>
      );
    case "predicate":
      return type.asserts ? (
        <>
          asserts <WrappedSignature type={type.targetType} />?
        </>
      ) : (
        <>
          {type.name} is <WrappedSignature type={type.targetType} />?
        </>
      );
    case "query":
      return (
        <>
          typeof <WrappedSignature type={type.queryType} />
        </>
      );
    case "reference": {
      if (type.id) {
        // TODO
        return typeAttachedReference?.reflection ? (
          <WrappedSignature
            type={typeAttachedReference.reflection}
            reference={type}
          />
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
          <WrappedSignature type={type.elementType} />
        </>
      );
    case "tuple":
      return (
        <>
          [
          {joinComponents(
            type.elements.map((t, i, a) => (
              <WrappedSignature key={i} type={t} />
            )),
            ", "
          )}
          ]
        </>
      );
    case "typeOperator":
      return (
        <>
          {type.operator} <WrappedSignature type={type.target} />
        </>
      );
    case "unknown":
      return <>{type.name}</>;
    case "mapped":
      return (
        <>
          {"{"}
          {type.readonlyModifier && `${type.readonlyModifier}readonly `}[$
          {type.parameter} in <WrappedSignature type={type.parameterType} />]
          {type.templateType.type === "optional" && "?"}:{" "}
          {type.optionalModifier}
          {type.templateType.type === "optional" ? (
            <WrappedSignature type={type.templateType.elementType} />
          ) : (
            <WrappedSignature type={type.templateType} />
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
              <WrappedSignature key={i} type={subtype} />
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
  if (!type) {
    return null;
  }
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
    case ReflectionKind.TypeLiteral:
      return (
        <DeclarationReflectionSignature type={type} reference={reference} />
      );

    case ReflectionKind.CallSignature:
    case ReflectionKind.ConstructorSignature:
    case ReflectionKind.SetSignature:
    case ReflectionKind.GetSignature:
      return <SignatureReflectionSignature type={type} reference={reference} />;

    case ReflectionKind.Accessor: {
      const getSignature = (type as any).getSignature?.[0];
      const setSignature = (type as any).setSignature?.[0];
      return (
        <>
          {"{{"}{" "}
          {getSignature && (
            <>
              get: <ReflectionSignature type={getSignature} />
              {", "}
            </>
          )}
          {setSignature && (
            <>
              get: <ReflectionSignature type={setSignature} />,
            </>
          )}
          {" }}"}
        </>
      );
    }

    case ReflectionKind.ObjectLiteral:
      return (
        <>
          {"{ "}
          {(type as JSONOutput.ContainerReflection).children?.map(
            (child, i, arr) => (
              <React.Fragment key={i}>
                {child.name}: <WrappedSignature type={child} />;{" "}
              </React.Fragment>
            )
          )}
          {"}"}
        </>
      );

    case ReflectionKind.Project:
    case ReflectionKind.Module:
    case ReflectionKind.Namespace:
    case ReflectionKind.Variable:
    case ReflectionKind.IndexSignature:
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
      case ReflectionKind.TypeLiteral:
        return (
          <ReflectionSignature
            type={type.signatures?.[0] ?? type.children?.[0]}
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
                <WrappedSignature type={type.type} />
              </>
            )}
            {isTypeParameter(type) && type.default && (
              <>
                {" = "}
                <WrappedSignature type={type.default} />
              </>
            )}
          </>
        );

      case ReflectionKind.Parameter:
        return (
          <>
            {type.name}: <WrappedSignature type={type.type} />
          </>
        );

      case ReflectionKind.Property:
        return <WrappedSignature type={type.type} />;

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
                    <WrappedSignature type={arg} key={index} />
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
            <WrappedSignature type={type.type} />
          </>
        );

      default:
        return null;
    }
  }
);
