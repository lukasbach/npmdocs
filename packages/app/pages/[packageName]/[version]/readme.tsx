import React, { FC } from "react";
import { DocsHeader } from "../../../src/components/docs/docs-header";
import { DocsSidebar } from "../../../src/components/docs/docs-sidebar";
import { LayoutContainer } from "../../../src/components/common/layout/layout-container";
import Head from "next/head";
import { useTriggerRedirect } from "../../../src/common/use-trigger-redirect";
import { useReadme } from "../../../src/api/api-helpers";
import { Markdown } from "../../../src/components/common/markdown";
import { usePkgQuery } from "../../../src/common/use-pkg-query";

const Page: FC = () => {
  useTriggerRedirect();
  const { packageName, version } = usePkgQuery();
  const { data } = useReadme(packageName, version);
  return (
    <LayoutContainer
      header={<DocsHeader />}
      sidebar={<DocsSidebar currentKey="readme" />}
    >
      <Head>
        <title>{`${packageName}@${version}`} readme</title>
      </Head>
      <Markdown markdown={data?.readme} />
    </LayoutContainer>
  );
};

export default Page;
