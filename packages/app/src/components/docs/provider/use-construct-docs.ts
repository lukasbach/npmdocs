import { useMemo } from "react";
import type { JSONOutput } from "typedoc";
import { usePkgQuery } from "../../../common/use-pkg-query";
import { useHash } from "../../../common/use-hash";
import { usePackageDocs } from "../../../api/api-helpers";
import { ReflectionKind } from "../../../common/reflection-kind";
import { getResolvedGroups } from "../../../common/get-resolved-groups";

export const useConstructDocs = () => {
  const { packageName, encodedPackageName, version } = usePkgQuery();
  const hash = useHash();
  const docs = usePackageDocs(packageName, version);

  const additionals = useMemo(() => {
    const [routeString, jumpToHighlight] = hash?.includes(":")
      ? hash.split(":")
      : [hash];
    const route = routeString?.includes(".")
      ? routeString?.split(".")
      : routeString?.length === 0
      ? []
      : [routeString];

    const { moduleDocs, moduleRoute } = getModule(route, docs.data);

    const moduleGroups = moduleDocs && getResolvedGroups(moduleDocs);
    const groups = docs.data && getResolvedGroups(docs.data);

    const docsBaseUrl = `${packageName}/${version}/`;
    const getRouteInNamespace = (name: string) =>
      "#" + [...moduleRoute, name].join(".");

    return {
      route,
      jumpToHighlight,
      moduleDocs,
      moduleGroups,
      moduleRoute,
      groups,
      docsBaseUrl,
      getRouteInNamespace,
    };
  }, [hash, docs.data, packageName, version]);

  const docsItems = {
    ...additionals,
    packageName,
    encodedPackageName,
    version,
    docs: docs.data,
    hash,
    isLoading: !!docs.data,
  };

  console.log("Compiled docs: ", docsItems);

  return docsItems;
};

const getModule = (route: string[], docs?: JSONOutput.ContainerReflection) => {
  if (!docs) {
    return {
      moduleRoute: [],
      moduleDocs: null,
    };
  }

  const moduleRoute: string[] = [];
  let currentContainer = docs;

  for (const part of route) {
    const child = currentContainer.children?.find(
      child => child.kind === ReflectionKind.Namespace && child.name === part
    );
    if (child) {
      moduleRoute.push(part);
      currentContainer = child;
    } else {
      break;
    }
  }

  return {
    moduleRoute,
    moduleDocs: currentContainer,
  };
};
