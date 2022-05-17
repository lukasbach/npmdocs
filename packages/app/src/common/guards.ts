import type { JSONOutput as JO } from "typedoc";
import { ReflectionKind as RK } from "../common/reflection-kind";
import { JSONOutput } from "typedoc";

const create =
  <Target extends JO.Reflection>(kind: RK) =>
  (reflection: any): reflection is Target => {
    return reflection.kind === kind;
  };

export const isClass = create<JO.DeclarationReflection>(RK.Class);
export const isInterface = create<JO.DeclarationReflection>(RK.Interface);
export const isEnum = create<JO.DeclarationReflection>(RK.Enum);
export const isNamespace = create<JO.DeclarationReflection>(RK.Namespace);

export const isContainerReflection = (
  reflection: JSONOutput.Reflection
): reflection is JSONOutput.ContainerReflection =>
  (reflection as JSONOutput.ContainerReflection).children !== undefined;
