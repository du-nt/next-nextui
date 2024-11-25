"use client";

import { useQuery } from "@/hooks/useQuery";
import useBoundStore from "@/stores";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useLayoutEffect } from "react";

export default function ProtectRoute({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  // const isAuthenticated = useBoundStore((state) => state.isAuthenticated);
  const { data } = useQuery<any>({
    queryKey: ["me"],
    enabled: false,
    // onSuccess: () => {
    //   authenticate();
    // },
  });

  const isAuthenticated = !!data;

  useLayoutEffect(() => {
    !isAuthenticated && router.replace(`/login?next=${pathname}`);
  }, [isAuthenticated, pathname, router]);

  return children;
}
