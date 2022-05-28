import React, { FC } from "react";
import { DocsHeader } from "../../../src/components/docs/docs-header";
import { DocsSidebar } from "../../../src/components/docs/docs-sidebar";
import { LayoutContainer } from "../../../src/components/common/layout/layout-container";
import Head from "next/head";
import { useTriggerRedirect } from "../../../src/common/use-trigger-redirect";
import { usePkgQuery } from "../../../src/common/use-pkg-query";
import { DocsProvider } from "../../../src/components/docs/provider/docs-provider";
import { DependenciesPage } from "../../../src/components/package/pages/dependencies-page";

const Page: FC = () => {
  useTriggerRedirect();
  const { packageName, version } = usePkgQuery();
  return (
    <DocsProvider>
      <LayoutContainer
        header={<DocsHeader />}
        sidebar={<DocsSidebar currentKey="dependencies" />}
      >
        <Head>
          <title>{`${packageName}@${version}`} dependencies</title>
        </Head>
        <DependenciesPage />
      </LayoutContainer>
    </DocsProvider>
  );
};

export default Page;
