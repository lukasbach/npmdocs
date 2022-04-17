import { getFolderContents } from "./helpers";

export const getVersions = async (packageName: string) => {
  const allVersionsPromise = fetch(
    `https://registry.npmjs.org/${packageName}`
  ).then(res => res.json());
  const generatedVersionsPromise = getFolderContents(`packages/${packageName}`);
  const [allVersions, generatedVersions] = await Promise.all([
    allVersionsPromise,
    generatedVersionsPromise,
  ]);
  const versions = Object.keys(allVersions.versions);
  return versions.reverse().reduce(
    (acc, version) => ({
      ...acc,
      [version]: {
        time: allVersions.time[version],
        built: generatedVersions?.includes(version) ?? false,
      },
    }),
    {} as Record<string, { time: string; built: boolean }>
  );
};
