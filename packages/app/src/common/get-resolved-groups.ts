import type { JSONOutput } from "typedoc";

export const getResolvedGroups = (container: JSONOutput.ContainerReflection) =>
  container.groups.map(group => ({
    ...group,
    resolvedChildren: group.children?.map(child => {
      const resolvedChild = container.children.find(c => c.id === child);

      if (resolvedChild) {
        return resolvedChild;
      }

      throw new Error(`Could not find child with id ${child}`);
    }),
  }));
