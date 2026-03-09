import { Sidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <header className="h-14 border-b border-divider flex items-center justify-end px-6 sticky top-0 bg-background z-10">
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 md:p-8 mt-14 md:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
}