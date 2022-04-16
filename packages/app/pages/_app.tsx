import "../styles/globals.css";
import { useEffect } from "react";
import React from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const mode = localStorage.getItem("mode") ?? "light";
    document.body.classList.add(mode);
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
