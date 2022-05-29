import "../styles/globals.css";
import { useEffect } from "react";
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
    </SettingsProvider>
  );
}

export default MyApp;
