import React, { FC } from "react";
import { DocsHeader } from "../../../src/components/docs/docs-header";
import { DocsSidebar } from "../../../src/components/docs/docs-sidebar";
import { LayoutContainer } from "../../../src/components/common/layout/layout-container";
import { useRouterQuery } from "../../../src/common/use-router-query";
import {
  usePackageDocs,
  usePackageVersions,
} from "../../../src/api/api-helpers";
import { HashRouter, Routes, Route } from "react-router-dom";
import { DocsPage } from "../../../src/components/docs/docs-page";

const Page: FC = () => {
  const { packageName, version } = useRouterQuery();
  const { data: docs, error } = usePackageDocs(packageName, version);
  return (
    <LayoutContainer
      header={<DocsHeader packageName={packageName} packageVersion={version} />}
      sidebar={
        <DocsSidebar packageName={packageName} packageVersion={version} />
      }
    >
      <DocsPage />
    </LayoutContainer>
  );
};

export default Page;
