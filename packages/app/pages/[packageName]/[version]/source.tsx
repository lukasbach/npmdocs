import React, { FC } from "react";
import { useTriggerRedirect } from "../../../src/common/use-trigger-redirect";
import { useRouterQuery } from "../../../src/common/use-router-query";
import { useReadme } from "../../../src/api/api-helpers";
import { LayoutContainer } from "../../../src/components/common/layout/layout-container";
import { DocsHeader } from "../../../src/components/docs/docs-header";
import Head from "next/head";
import { SourceSidebar } from "../../../src/components/source/source-sidebar";

const Page: FC = () => {
  useTriggerRedirect();
  const { packageName, version } = useRouterQuery();
  const { data } = useReadme(packageName, version);
  return (
    <LayoutContainer
      header={<DocsHeader packageName={packageName} packageVersion={version} />}
      sidebar={<SourceSidebar />}
    >
      <Head>
        <title>{`${packageName}@${version}`} source</title>
      </Head>
      source
    </LayoutContainer>
  );
};

export default Page;
