import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <button
      type="button"
      aria-label={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Theme toggle"}
      aria-pressed={mounted ? isDark : undefined}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed top-[max(1rem,env(safe-area-inset-top))] right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-ch-border bg-ch-surface/80 text-ch-text backdrop-blur transition-colors hover:border-ch-primary disabled:pointer-events-none motion-safe:hover:scale-105 motion-reduce:hover:scale-100"
    >
      {!mounted ? (
        <span className="h-4 w-4" aria-hidden />
      ) : isDark ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
