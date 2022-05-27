import useSWR from "swr";
import { ITsDocBase, ITypescriptPluginData } from "@documentalist/client";
import type { JSONOutput } from "typedoc";
import { useMemo } from "react";
import { SWRConfiguration } from "swr/dist/types";
import { decompress } from "compress-json";

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (res.status === 404) {
    const err = new Error(`Not found: ${url}`);
    (err as any).status = 404;
    throw err;
  }
  return await res.json();
};

export const commonSwrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const useDecompressed = <T extends ReturnType<typeof useSWR>>({
  data: originalData,
  ...rest
}: T): T => {
  const data = useMemo(
    () => (originalData ? decompress(originalData as any) : null),
    [originalData]
  );
  return { data, ...rest } as T;
};

export const usePackageVersions = (packageName: string) =>
  useSWR<Record<string, { time: string; built: boolean }>>(
    packageName && `/api/${packageName}/versions`,
    fetcher,
    commonSwrConfig
  );

export const useAboutPackage = (packageName: string) =>
  useSWR<any>(`/api/${packageName}/about`, fetcher, commonSwrConfig);

export const useReadme = (packageName: string, version: string) =>
  useSWR<any>(
    packageName && version && `/api/${packageName}/${version}/readme`,
    fetcher,
    commonSwrConfig
  );

export const usePackageJson = (packageName: string, version: string) =>
  useSWR<any>(
    packageName && version && `/api/${packageName}/${version}/packagejson`,
    fetcher,
    commonSwrConfig
  );

export const usePackageDocs = (packageName: string, version: string) =>
  useDecompressed(
    useSWR<JSONOutput.ProjectReflection>(
      packageName && version && `/api/${packageName}/${version}/docs`,
      fetcher,
      commonSwrConfig
    )
  );

export const usePackageSource = (packageName: string, version: string) =>
  useDecompressed(
    useSWR<Record<string, true | object>>(
      packageName && version && `/api/${packageName}/${version}/folder`,
      fetcher,
      commonSwrConfig
    )
  );

export const useRecentBuilds = () =>
  useSWR<{ packageName: string; version: string }[]>(
    "/api/recent-builds",
    fetcher,
    commonSwrConfig
  );

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
