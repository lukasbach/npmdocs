import React, { FC, ReactNode } from "react";
import {
  useAboutPackage,
  useAboutPackageVersion,
} from "../../../api/api-helpers";
import { useDocs } from "../provider/use-docs";
import prettyBytes from "pretty-bytes";

import style from "./styles.module.css";

export const ProjectHeader: FC = () => {
  const { encodedPackageName, version } = useDocs();
  const { data } = useAboutPackageVersion(encodedPackageName, version);

  if (!data?.hasBundlephobiaLoaded) {
    return null;
  }

  return (
    <div className={style.detailsList}>
      <div className={style.detailsItem}>
        <div className={style.detailsValue}>{prettyBytes(data.size)}</div>
        <div className={style.detailsLabel}>Bundle Size</div>
      </div>
      <div className={style.detailsItem}>
        <div className={style.detailsValue}>{prettyBytes(data.gzip)}</div>
        <div className={style.detailsLabel}>Bundle Size</div>
      </div>
      <div className={style.detailsItem}>
        <div className={style.detailsValue}>
          {data.hasSideEffects ? "Yes" : "No"}
        </div>
        <div className={style.detailsLabel}>Sideeffects</div>
      </div>
      <div className={style.detailsItem}>
        <div className={style.detailsValue}>
          {data.isModuleType ? "Module" : "No Module"}
        </div>
        <div className={style.detailsLabel}>Module Type</div>
      </div>
    </div>
  );
};
