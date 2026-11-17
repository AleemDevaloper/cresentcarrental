import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggle: () => {},
});

export function useSiteTheme() {
  return useContext(ThemeContext);
}

function readStoredTheme() {
  try {
    const saved = localStorage.getItem("mc-theme");
    if (saved === "light" || saved === "dark") return saved;
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
  } catch {
    /* ignore */
  }
  return "light";
}

export function SiteThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = readStoredTheme();
    setTheme(initial);
    setReady(true);
    const html = document.documentElement;
    html.setAttribute("data-site", "marketing");
    html.classList.toggle("mc-site-dark", initial === "dark");
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("mc-theme", theme);
    } catch {
      /* ignore */
    }
    const html = document.documentElement;
    html.classList.toggle("mc-site-dark", theme === "dark");
    const root = document.querySelector(".mc-root");
    root?.setAttribute("data-theme", theme);
  }, [theme, ready]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div className="mc-root" data-theme={theme} suppressHydrationWarning>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
