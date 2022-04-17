import React, { FC } from "react";
import Head from "next/head";
import { LayoutContainer } from "../src/components/common/layout/layout-container";
import { MetaHeader } from "../src/components/meta/meta-header";
import { StartPage } from "../src/components/meta/start-page/start-page";

const Page: FC = () => {
  return (
    <LayoutContainer header={<MetaHeader />}>
      <Head>
        <title>npmdocs</title>
      </Head>
      <StartPage />
    </LayoutContainer>
  );
};

export default Page;
