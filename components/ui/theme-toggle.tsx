"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

const SystemIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>
  </svg>
);

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentIcon =
    theme === "dark" ? <MoonIcon /> :
    theme === "light" ? <SunIcon /> :
    <SystemIcon />;

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          aria-label="Cambiar tema"
          className="text-default-500"
        >
          {currentIcon}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Tema"
        selectedKeys={[theme ?? "system"]}
        selectionMode="single"
        onAction={(key) => setTheme(key as string)}
      >
        <DropdownItem key="light" startContent={<SunIcon />}>
          Light
        </DropdownItem>
        <DropdownItem key="dark" startContent={<MoonIcon />}>
          Dark
        </DropdownItem>
        <DropdownItem key="system" startContent={<SystemIcon />}>
          System
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}