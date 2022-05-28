import React, {
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTabsContext } from "@reach/tabs";
import { useDocs } from "../provider/use-docs";
import NProgress from "nprogress";
import { isDeclarationReflection } from "../../../common/guards";
import { usePackageJson } from "../../../api/api-helpers";
import { DocsEditor } from "./docs-editor";

export const PackagejsonSource: FC<{ tabIndex: number }> = ({ tabIndex }) => {
  const { encodedPackageName, version } = useDocs();
  const { data } = usePackageJson(encodedPackageName, version);
  const [code, setCode] = useState("");
  const { selectedIndex } = useTabsContext();

  useEffect(() => setCode(JSON.stringify(data, null, 2)), [data]);

  const isTabSelected = tabIndex === selectedIndex;

  if (!isTabSelected) {
    return null;
  }

  return <DocsEditor code={code} language="json" />;
};
