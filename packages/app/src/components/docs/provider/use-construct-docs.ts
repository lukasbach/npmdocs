import { useMemo } from "react";
import type { JSONOutput } from "typedoc";
import { usePkgQuery } from "../../../common/use-pkg-query";
import { useHash } from "../../../common/use-hash";
import { usePackageDocs } from "../../../api/api-helpers";
import { ReflectionKind } from "../../../common/reflection-kind";
import { getResolvedGroups } from "../../../common/get-resolved-groups";
import { isContainerReflection } from "../../../common/guards";
import { useConstructLookupMap } from "./use-construct-lookup-map";

export const useConstructDocs = () => {
  const { packageName, encodedPackageName, version } = usePkgQuery();
  const hash = useHash();
  const docs = usePackageDocs(encodedPackageName, version);
  const lookupMap = useConstructLookupMap(docs.data);

  const additionals = useMemo(() => {
    if (isBuildError(docs?.data)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return {};
    }

    const [routeString, jumpToHighlight] = hash?.includes(":")
      ? hash.split(":")
      : [hash];
    const route = routeString?.includes(".")
      ? routeString?.split(".")
      : routeString?.length === 0
      ? []
      : [routeString];

    console.log("!", docs.data);
    const { targetDocs: moduleDocs, targetRoute: moduleRoute } =
      traverseContainer(route, docs.data, ReflectionKind.Namespace);
    const { targetDocs: symbolDocs } = traverseContainer(route, docs.data);

    const moduleGroups = moduleDocs && getResolvedGroups(moduleDocs);
    const groups = docs.data && getResolvedGroups(docs.data);

    const docsBaseUrl = `${encodedPackageName}/${version}/`;
    const getRouteInNamespace = (name: string) =>
      "#" + [...moduleRoute, name].join(".");

    return {
      route,
      jumpToHighlight,
      moduleDocs,
      moduleGroups,
      moduleRoute,
      symbolDocs,
      groups,
      docsBaseUrl,
      getRouteInNamespace,
    };
  }, [hash, docs.data, packageName, version]);

  const docsItems = {
    ...additionals,
    error: isBuildError(docs?.data) ? docs.data : undefined,
    lookupMap,
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

const traverseContainer = (
  route: string[],
  docs?: JSONOutput.Reflection,
  onlyTraverseReflectionKind?: ReflectionKind
) => {
  if (!docs) {
    return {
      targetRoute: [],
      targetDocs: null,
    };
  }

  const targetRoute: string[] = [];
  let currentContainer = docs;

  for (const part of route) {
    const child =
      isContainerReflection(currentContainer) &&
      currentContainer.children.find(
        child =>
          (onlyTraverseReflectionKind
            ? child.kind === onlyTraverseReflectionKind
            : true) && child.name === part
      );
    if (child) {
      targetRoute.push(part);
      currentContainer = child;
    } else {
      break;
    }
  }

  return {
    targetRoute,
    targetDocs: currentContainer,
  };
};

const isBuildError = (
  docs: any
): docs is {
  error: string;
  errorCode: string;
  details: string;
} => docs?.error !== undefined;
