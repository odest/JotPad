import { createContext, useContext, useEffect, useState } from "react";

type ThemeSetting = "light" | "dark" | "system";
type AppliedTheme = "light" | "dark";

const availableColorThemes = ["zinc", "red", "rose", "orange", "green", "blue", "yellow", "violet"] as const;
export type ColorThemeName = typeof availableColorThemes[number];

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeSetting;
  defaultColorTheme?: ColorThemeName;
  storageKeyTheme?: string;
  storageKeyColor?: string;
};

type ThemeProviderState = {
  themeSetting: ThemeSetting;
  appliedTheme: AppliedTheme;
  setTheme: (theme: ThemeSetting) => void;
  colorTheme: ColorThemeName;
  setColorTheme: (colorTheme: ColorThemeName) => void;
};

const initialState: ThemeProviderState = {
  themeSetting: "system",
  appliedTheme: "light",
  setTheme: () => null,
  colorTheme: "zinc",
  setColorTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorTheme = "zinc",
  storageKeyTheme = "vite-ui-theme-setting",
  storageKeyColor = "vite-ui-color-theme",
  ...props
}: ThemeProviderProps) {
  const [themeSetting, setThemeSetting] = useState<ThemeSetting>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKeyTheme) as ThemeSetting) || defaultTheme;
    }
    return defaultTheme;
  });

  const [appliedTheme, setAppliedTheme] = useState<AppliedTheme>(() => {
    if (typeof window === "undefined") return themeSetting === "dark" ? "dark" : "light";
    if (themeSetting === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return themeSetting;
  });

  const [colorTheme, setColorThemeState] = useState<ColorThemeName>(() => {
    if (typeof window !== "undefined") {
      const storedColor = localStorage.getItem(storageKeyColor) as ColorThemeName;
      return availableColorThemes.includes(storedColor) ? storedColor : defaultColorTheme;
    }
    return defaultColorTheme;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let currentAppliedTheme: AppliedTheme;
    if (themeSetting === "system") {
      currentAppliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      currentAppliedTheme = themeSetting;
    }
    if (currentAppliedTheme === 'dark') {
        root.classList.add("dark");
    }
    setAppliedTheme(currentAppliedTheme);
    localStorage.setItem(storageKeyTheme, themeSetting);
  }, [themeSetting, storageKeyTheme]);

  useEffect(() => {
    if (typeof window === "undefined" || themeSetting !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const root = window.document.documentElement;
    
    const handleChange = () => {
      const newAppliedTheme = mediaQuery.matches ? "dark" : "light";
      setAppliedTheme(newAppliedTheme);
      root.classList.remove("light", "dark");
      if (newAppliedTheme === 'dark') {
          root.classList.add("dark");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeSetting]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;

    if (colorTheme === "zinc" || !colorTheme) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", colorTheme);
    }
    localStorage.setItem(storageKeyColor, colorTheme);
  }, [colorTheme, storageKeyColor]);

  const value = {
    themeSetting,
    appliedTheme,
    setTheme: (newThemeSetting: ThemeSetting) => {
      setThemeSetting(newThemeSetting);
    },
    colorTheme,
    setColorTheme: (newColorTheme: ColorThemeName) => {
      setColorThemeState(newColorTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};