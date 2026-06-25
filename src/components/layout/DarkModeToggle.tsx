import { useEffect, useState } from "react";
import { Moon, Monitor, Sun } from "lucide-react";

type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "taskpilot-theme";

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveIsDark(preference: ThemePreference): boolean {
  if (preference === "system") {
    return getSystemPrefersDark();
  }

  return preference === "dark";
}

function applyThemeClass(isDark: boolean): void {
  document.documentElement.classList.toggle("dark", isDark);
}

function getStoredPreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (
    stored === "light" ||
    stored === "dark" ||
    stored === "system"
  ) {
    return stored;
  }

  return "system";
}

function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(
    getStoredPreference,
  );

  useEffect(() => {
    applyThemeClass(resolveIsDark(preference));
    localStorage.setItem(STORAGE_KEY, preference);
  }, [preference]);

  useEffect(() => {
    if (preference !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      applyThemeClass(getSystemPrefersDark());
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, [preference]);

  return {
    preference,
    setPreference,
  };
}

const OPTIONS = [
  {
    value: "light" as ThemePreference,
    icon: Sun,
    label: "Light mode",
  },
  {
    value: "system" as ThemePreference,
    icon: Monitor,
    label: "System theme",
  },
  {
    value: "dark" as ThemePreference,
    icon: Moon,
    label: "Dark mode",
  },
];

export function DarkModeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div
      className="
        relative
        flex
        items-center
        gap-0.5
        rounded-full
        border
        border-neutral-200
        bg-white/80
        p-1
        shadow-sm
        backdrop-blur-md
        dark:border-neutral-700
        dark:bg-neutral-900/80
      "
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => {
        const isActive = preference === value;

        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            title={label}
            onClick={() => setPreference(value)}
            className={`
              relative
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              transition-all
              duration-200
              ease-out
              ${
                isActive
                  ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                  : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
              }
            `}
          >
            <Icon
              className={`h-4 w-4 transition-all duration-200 ${
                isActive ? "scale-100" : "scale-95"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}