import type { ReactNode } from "react";

export interface AppShellProps {
  children: ReactNode;
  header?: ReactNode;
}

export function AppShell({ children, header }: AppShellProps) {
  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-slate-100
      via-blue-50
      to-indigo-100
      transition-all
      duration-300

      dark:from-[#0B1220]
      dark:via-[#111827]
      dark:to-[#1E293B]
    "
    >
      {header && (
        <header
          className="
          sticky
          top-0
          z-50

          border-b
          border-white/20

          bg-white/60
          backdrop-blur-xl

          dark:border-white/10
          dark:bg-black/20
        "
        >
          <div
            className="
            mx-auto
            flex
            max-w-[430px]
            items-center
            justify-between
            px-5
            py-4
          "
          >
            {header}
          </div>
        </header>
      )}

      <main
        className="
        mx-auto
        flex
        max-w-[430px]
        flex-col
        gap-8

        px-5
        py-8
      "
      >
        {children}
      </main>
    </div>
  );
}