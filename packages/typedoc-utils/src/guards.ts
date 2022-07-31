import type { JSONOutput as JO } from "typedoc";
import { ReflectionKind as RK } from "./reflection-kind";

const createReflG =
  <Target extends JO.Reflection>(...kinds: RK[]) =>
  (reflection: any | undefined): reflection is Target => {
    return kinds.includes(reflection?.kind);
  };

// TODO replace all with isDeclarationReflection ?

export const isClass = createReflG<JO.DeclarationReflection>(RK.Class);
export const isInterface = createReflG<JO.DeclarationReflection>(RK.Interface);
export const isEnum = createReflG<JO.DeclarationReflection>(RK.Enum);
export const isNamespace = createReflG<JO.DeclarationReflection>(RK.Namespace);
export const isProject = createReflG<JO.DeclarationReflection>(RK.Project);
export const isParameter = createReflG<JO.DeclarationReflection>(RK.Parameter);
export const isMethod = createReflG<JO.DeclarationReflection>(RK.Method);
export const isFunction = createReflG<JO.DeclarationReflection>(RK.Function);
export const isTypeAlias = createReflG<JO.DeclarationReflection>(RK.TypeAlias);
export const isConstructor = createReflG<JO.DeclarationReflection>(
  RK.Constructor
);
export const isConstructorSignature = createReflG<JO.DeclarationReflection>(
  RK.ConstructorSignature
);
export const isCallSignature = createReflG<JO.DeclarationReflection>(
  RK.CallSignature
);
export const isTypeParameter = createReflG<JO.TypeParameterReflection>(
  RK.TypeParameter
);

export const hasSignatures = createReflG<JO.DeclarationReflection>(
  RK.Method,
  RK.Constructor,
  RK.Function
);

export const hasInheritance = (
  reflection: JO.Reflection
): reflection is JO.Reflection &
  Required<{
    inheritedFrom: JO.DeclarationReflection["inheritedFrom"];
  }> => (reflection as JO.DeclarationReflection).inheritedFrom !== undefined;

export const isContainerReflection = (
  reflection: any | undefined
): reflection is JO.ContainerReflection =>
  (reflection as JO.ContainerReflection)?.children !== undefined;

export const isReflection = (
  reflection: any | undefined
): reflection is JO.Reflection =>
  (reflection as JO.Reflection)?.kind !== undefined;

export const isDeclarationReflection = (
  reflection: any | undefined
): reflection is JO.DeclarationReflection =>
  (reflection as JO.DeclarationReflection)?.kind !== undefined; // TODO ?
