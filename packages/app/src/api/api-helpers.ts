import useSWR from "swr";
import { ITsDocBase, ITypescriptPluginData } from "@documentalist/client";
import { useMemo } from "react";

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
};

export const usePackageVersions = (packageName: string) =>
  useSWR<Record<string, { time: string; built: boolean }>>(
    `/api/${packageName}/versions`,
    fetcher
  );

export const useAboutPackage = (packageName: string) =>
  useSWR<any>(`/api/${packageName}/about`, fetcher);

export const usePackageDocs = (packageName: string, version: string) =>
  useSWR<ITypescriptPluginData>(`/api/${packageName}/${version}/docs`, fetcher);

export type Typeguard<T extends ITsDocBase> = (data: any) => data is T;

export const useFilteredDocsEntity = <T extends ITsDocBase>(
  docs: ITypescriptPluginData | undefined,
  guard: Typeguard<T>
): Record<string, T> | undefined =>
  useMemo(() => {
    if (!docs?.typescript) {
      return undefined;
    }

    const result = Object.entries(docs.typescript)
      .filter(([, item]) => guard(item))
      .reduce((acc, [key, item]) => ({ ...acc, [key]: item }), {});

    if (Object.keys(result).length === 0) {
      return undefined;
    }

    return result;
  }, [docs, guard]);
