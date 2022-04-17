import { useRouterQuery } from "./use-router-query";
import { usePackageDocs } from "../api/api-helpers";
import { useEffect } from "react";

export const useTriggerRedirect = () => {
  const { packageName, version } = useRouterQuery();
  const { error } = usePackageDocs(packageName, version);

  useEffect(() => {
    console.log(error);
    if (error?.status === 404) {
      location.replace(`/${packageName}/${version}/trigger`);
    }
  }, [error]);
};
