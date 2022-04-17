import React, { FC } from "react";
import { DocsHeader } from "../../../src/components/docs/docs-header";
import { DocsSidebar } from "../../../src/components/docs/docs-sidebar";
import { LayoutContainer } from "../../../src/components/common/layout/layout-container";
import { useRouterQuery } from "../../../src/common/use-router-query";
import Head from "next/head";
import { useTriggerRedirect } from "../../../src/common/use-trigger-redirect";

const Page: FC = () => {
  useTriggerRedirect();
  const { packageName, version } = useRouterQuery();
  return (
    <LayoutContainer
      header={<DocsHeader packageName={packageName} packageVersion={version} />}
      sidebar={
        <DocsSidebar packageName={packageName} packageVersion={version} />
      }
    >
      <Head>
        <title>{`${packageName}@${version}`} readme</title>
      </Head>
      Readme
    </LayoutContainer>
  );
};

export default Page;
