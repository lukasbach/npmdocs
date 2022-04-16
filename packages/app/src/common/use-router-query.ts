import { useRouter } from "next/router";

export const useRouterQuery = () => {
  const router = useRouter();
  return router.query as Record<string, string>;
};
