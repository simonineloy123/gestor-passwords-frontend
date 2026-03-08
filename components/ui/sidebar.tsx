"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { clearAuth } from "@/lib/auth";
import { ThemeToggle } from "./theme-toggle";
import { toast } from "sonner";

const navItems = [
  {
    label: "Contraseñas",
    href: "/passwords",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    label: "Generador",
    href: "/generator",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    toast.success("Sesión cerrada correctamente");
    router.push("/login");
  };

  return (
    <aside className="flex flex-col w-64 h-screen bg-content1 border-r border-divider px-4 py-6 fixed left-0 top-0">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <span className="font-bold text-lg">PassVault</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "flat" : "light"}
            color={pathname === item.href ? "primary" : "default"}
            className="justify-start gap-3 h-11"
            startContent={item.icon}
            onPress={() => router.push(item.href)}
          >
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm text-default-500">Tema</span>
          <ThemeToggle />
        </div>
        <Button
          variant="light"
          color="danger"
          className="justify-start gap-3 h-11"
          startContent={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
          }
          onPress={handleLogout}
        >
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}