import "../styles/globals.css";
import Head from "next/head";
import React from "react";
import Router from "next/router";
import NProgress from "nprogress";
import { SettingsProvider } from "../src/components/settings/settings-provider";

import "nprogress/nprogress.css";

NProgress.configure({ trickleSpeed: 100, showSpinner: false });
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <Component {...pageProps} />
      <Head>
        <link rel="icon" href="/_res/favicon.ico" sizes="any" />
        <link rel="icon" href="/_res/favicon.svg" type="image/svg+xml" />
      </Head>
    </SettingsProvider>
  );
}

export default MyApp;
