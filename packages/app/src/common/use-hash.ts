import { useEffect, useState } from "react";

export const useHash = () => {
  const [hash, setHash] = useState<string>();

  useEffect(() => {
    const handler = () => setHash(window.location.hash.slice(1));
    handler();
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return hash;
};
