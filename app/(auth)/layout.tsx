"use client";

import { useQuery } from "@/hooks/useQuery";
import useBoundStore from "@/stores";
import { useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren, useEffect, useLayoutEffect } from "react";

export default function AuthRoute({ children }: PropsWithChildren) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const isAuthenticated = useBoundStore((state) => state.isAuthenticated);
  const from = searchParams.get("next") || "/";

  const { data } = useQuery<any>({
    queryKey: ["me"],
    enabled: false,
    // onSuccess: () => {
    //   authenticate();
    // },
  });

  const isAuthenticated = !!data;
  useLayoutEffect(() => {
    isAuthenticated && router.replace(from);
  }, [from, isAuthenticated, router]);

  return children;
}
