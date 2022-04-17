import { useRouterQuery } from "../../common/use-router-query";
import { usePackageDocs } from "../../api/api-helpers";

export const useDocs = () => {
  const { packageName, version } = useRouterQuery();
  const { data: docs } = usePackageDocs(packageName, version);
  return docs?.typescript;
};
