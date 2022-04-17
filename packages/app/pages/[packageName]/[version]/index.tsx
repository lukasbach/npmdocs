import React, { FC } from "react";
import { DocsHeader } from "../../../src/components/docs/docs-header";
import { DocsSidebar } from "../../../src/components/docs/docs-sidebar";
import { LayoutContainer } from "../../../src/components/common/layout/layout-container";
import { DocsPage } from "../../../src/components/docs/docs-page";
import Head from "next/head";
import { useTriggerRedirect } from "../../../src/common/use-trigger-redirect";
import { usePkgQuery } from "../../../src/common/use-pkg-query";

const Page: FC = () => {
  useTriggerRedirect();
  const { packageName, version } = usePkgQuery();
  return (
    <LayoutContainer header={<DocsHeader />} sidebar={<DocsSidebar />}>
      <Head>
        <title>{`${packageName}@${version}`} docs</title>
      </Head>
      <DocsPage />
    </LayoutContainer>
  );
};

export default Page;
