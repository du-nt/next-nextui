"use client";

import useBoundStore from "@/stores";
import { useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren, useLayoutEffect } from "react";

export default function AuthRoute({ children }: PropsWithChildren) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useBoundStore((state) => state.isAuthenticated);
  console.log("first", isAuthenticated);
  const from = searchParams.get("from") || "/";

  useLayoutEffect(() => {
    isAuthenticated && router.replace(from);
  }, [from, isAuthenticated, router]);

  return children;
}
