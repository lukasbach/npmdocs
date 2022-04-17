import { useRouter } from "next/router";

export const usePkgQuery = () => {
  const router = useRouter();
  const { packageName, version } = router.query as Record<string, string>;
  return {
    version,
    packageName: packageName?.replace("__", "/"),
    encodedPackageName: packageName,
  };
};
