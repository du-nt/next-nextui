"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import useBoundStore from "@/stores";
import { useQuery } from "@/hooks/useQuery";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function UIProviders({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const authenticate = useBoundStore((state) => state.authenticate);
  const { isFetchedAfterMount } = useQuery<any>({
    queryKey: ["me"],
    onSuccess: () => {
      authenticate();
    },
  });

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </NextUIProvider>
  );
}
