import React, { FC } from "react";
import { DocsHeader } from "../../../src/components/docs/docs-header";
import { DocsSidebar } from "../../../src/components/docs/docs-sidebar";
import { LayoutContainer } from "../../../src/components/common/layout/layout-container";
import Head from "next/head";
import { useTriggerRedirect } from "../../../src/common/use-trigger-redirect";
import { useReadme } from "../../../src/api/api-helpers";
import { usePkgQuery } from "../../../src/common/use-pkg-query";
import { DocsProvider } from "../../../src/components/docs/provider/docs-provider";
import { VersionsPage } from "../../../src/components/package/pages/versions-page";

const Page: FC = () => {
  useTriggerRedirect();
  const { packageName, version } = usePkgQuery();
  return (
    <DocsProvider>
      <LayoutContainer
        header={<DocsHeader />}
        sidebar={<DocsSidebar currentKey="versions" />}
      >
        <Head>
          <title>{packageName} versions</title>
        </Head>
        <VersionsPage />
      </LayoutContainer>
    </DocsProvider>
  );
};

export default Page;
