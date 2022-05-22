import { useRouterQuery } from "./use-router-query";
import { usePackageDocs } from "../api/api-helpers";
import { useEffect } from "react";
import { usePkgQuery } from "./use-pkg-query";

export const useTriggerRedirect = () => {
  const { encodedPackageName, version } = usePkgQuery();
  const { error } = usePackageDocs(encodedPackageName, version);

  useEffect(() => {
    console.log(error);
    if (error?.status === 404) {
      location.replace(`/${encodedPackageName}/${version}/trigger`);
    }
  }, [error]);
};
