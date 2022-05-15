import React, { FC } from "react";
import { useTriggerRedirect } from "../../../src/common/use-trigger-redirect";
import { useReadme } from "../../../src/api/api-helpers";
import { LayoutContainer } from "../../../src/components/common/layout/layout-container";
import { DocsHeader } from "../../../src/components/docs/docs-header";
import Head from "next/head";
import { SourceSidebar } from "../../../src/components/source/source-sidebar";
import { CodeView } from "../../../src/components/source/code-view";
import { usePkgQuery } from "../../../src/common/use-pkg-query";

const Page: FC = () => {
  useTriggerRedirect();
  const { packageName, version } = usePkgQuery();
  const { data } = useReadme(packageName, version);
  return (
    <LayoutContainer header={<DocsHeader />} sidebar={<SourceSidebar />}>
      <Head>
        <title>{`${packageName}@${version}`} source</title>
      </Head>
      <CodeView />
    </LayoutContainer>
  );
};

export default Page;
