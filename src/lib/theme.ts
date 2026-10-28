import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "delegate.theme";

const systemDark = () => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

export function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(() => {
    try { const v = JSON.parse(localStorage.getItem(KEY) ?? "null"); return v === "light" || v === "dark" ? v : null; } catch { return null; }
  });
  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
  }, [theme]);
  const isDark = theme ? theme === "dark" : systemDark();
  const toggle = () => {
    const next: Theme = isDark ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };
  return { isDark, toggle };
}
