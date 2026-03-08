"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function AppToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      richColors
      position="bottom-right"
      closeButton
      theme={theme as "light" | "dark" | "system"}
    />
  );
}