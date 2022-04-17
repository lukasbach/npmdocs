import { useCallback, useEffect, useState } from "react";

export const useHash = () => {
  const [hash, setHash] = useState<string>();
  const handler = useCallback(() => {
    const nextHash = global?.window?.location?.hash.slice(1);

    if (nextHash !== hash) {
      setHash(nextHash);
    }
  }, [hash]);

  useEffect(() => {
    handler();
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  handler();

  return hash;
};
