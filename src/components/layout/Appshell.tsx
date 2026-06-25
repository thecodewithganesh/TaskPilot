import type { ReactNode } from "react";

export interface AppShellProps {
  children: ReactNode;
  header?: ReactNode;
}

export function AppShell({ children, header }: AppShellProps) {
  return (
    <div className="min-h-screen bg-neutral-50 transition-colors duration-200 dark:bg-neutral-900">
      {header && (
        <div className="sticky top-0 z-10 border-b border-neutral-200/80 bg-neutral-50/80 backdrop-blur-md transition-colors duration-200 dark:border-neutral-800/80 dark:bg-neutral-900/80">
          <div className="mx-auto flex w-full max-w-[720px] items-center px-4 py-4 sm:px-6">
            {header}
          </div>
        </div>
      )}

      <main className="mx-auto flex w-full max-w-[720px] flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
        {children}
      </main>
    </div>
  );
}