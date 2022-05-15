import React, { FC, useEffect, useRef } from "react";
import { DocsHeader } from "../../../src/components/docs/docs-header";
import { LayoutContainer } from "../../../src/components/common/layout/layout-container";
import { useRouterQuery } from "../../../src/common/use-router-query";
import Head from "next/head";
import { Loader } from "../../../src/components/loader/loader";

const Page: FC = () => {
  const { packageName, version } = useRouterQuery();
  const hasStarted = useRef(false);

  console.log(packageName, version);
  useEffect(() => {
    if (!packageName || !version || hasStarted.current) {
      return;
    }
    hasStarted.current = true;

    (async () => {
      const result = await fetch(`/api/${packageName}/${version}/trigger`, {
        method: "POST",
      });
      if (!result.ok) {
        alert((await result.json()).error);
      }
    })();
    const interval = setInterval(async () => {
      const pingResult = await fetch(`/api/${packageName}/${version}/ping`);
      if (pingResult.ok) {
        location.replace(`/${packageName}/${version}`);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [packageName, version]);

  return (
    <LayoutContainer header={<DocsHeader />}>
      <Head>
        <title>{`${packageName}@${version}`}</title>
      </Head>
      <Loader
        title="Looks like this package has not been built yet..."
        subtitle="The build is running and will take about 30 seconds. The page will automatically refresh once the build is complete."
      />
    </LayoutContainer>
  );
};

export default Page;
