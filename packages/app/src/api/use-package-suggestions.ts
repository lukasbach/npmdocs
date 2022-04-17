import useSWR from "swr";
import { fetcher } from "./api-helpers";
import { useEffect, useState } from "react";

export const usePackageSuggestions = (typed: string) => {
  const [delayedTyped, setDelayedTyped] = useState("");
  const { data } = useSWR<
    {
      name: string;
      scope: string | "unscoped";
      version: string;
      date: string;
    }[]
  >(`/api/suggestions?q=${delayedTyped}`, fetcher);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedTyped(typed);
    }, 500);
    return () => clearTimeout(timeout);
  }, [typed]);

  return data;
};
