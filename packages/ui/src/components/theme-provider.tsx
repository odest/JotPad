import { createContext, useContext, useEffect, useState } from "react";

type ThemeSetting = "light" | "dark" | "system";
type AppliedTheme = "light" | "dark";

const availableColorThemes = ["zinc", "red", "rose", "orange", "green", "blue", "yellow", "violet"] as const;
export type ColorThemeName = typeof availableColorThemes[number];

export type BackgroundSettings = {
  showBackground: boolean;
  useCustomImage: boolean;
  customImageSrc: string | null;
  opacity: number;
  brightness: number;
  blur: number;
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeSetting;
  defaultColorTheme?: ColorThemeName;
  defaultBackgroundSettings?: Partial<BackgroundSettings>;
  storageKeyTheme?: string;
  storageKeyColor?: string;
  storageKeyBackground?: string;
};

type ThemeProviderState = {
  themeSetting: ThemeSetting;
  appliedTheme: AppliedTheme;
  setTheme: (theme: ThemeSetting) => void;
  colorTheme: ColorThemeName;
  setColorTheme: (colorTheme: ColorThemeName) => void;
  backgroundSettings: BackgroundSettings;
  setBackgroundSettings: (settings: Partial<BackgroundSettings>) => void;
};

const defaultInitialBackgroundSettings: BackgroundSettings = {
  showBackground: true,
  useCustomImage: false,
  customImageSrc: null,
  opacity: 30,
  brightness: 100,
  blur: 0,
};

const initialState: ThemeProviderState = {
  themeSetting: "system",
  appliedTheme: "light",
  setTheme: () => null,
  colorTheme: "zinc",
  setColorTheme: () => null,
  backgroundSettings: defaultInitialBackgroundSettings,
  setBackgroundSettings: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorTheme = "zinc",
  defaultBackgroundSettings: propDefaultBackgroundSettings = {},
  storageKeyTheme = "vite-ui-theme-setting",
  storageKeyColor = "vite-ui-color-theme",
  storageKeyBackground = "vite-chat-background-settings",
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

  const [backgroundSettings, setBackgroundSettingsState] = useState<BackgroundSettings>(() => {
    const mergedDefaults = { ...defaultInitialBackgroundSettings, ...propDefaultBackgroundSettings };
    if (typeof window !== "undefined") {
      const storedSettings = localStorage.getItem(storageKeyBackground);
      if (storedSettings) {
        try {
          const parsedSettings = JSON.parse(storedSettings) as Partial<BackgroundSettings>;
          return {
            showBackground: parsedSettings.showBackground !== undefined ? parsedSettings.showBackground : mergedDefaults.showBackground,
            useCustomImage: parsedSettings.useCustomImage !== undefined ? parsedSettings.useCustomImage : mergedDefaults.useCustomImage,
            customImageSrc: parsedSettings.customImageSrc !== undefined ? parsedSettings.customImageSrc : mergedDefaults.customImageSrc,
            opacity: parsedSettings.opacity !== undefined ? parsedSettings.opacity : mergedDefaults.opacity,
            brightness: parsedSettings.brightness !== undefined ? parsedSettings.brightness : mergedDefaults.brightness,
            blur: parsedSettings.blur !== undefined ? parsedSettings.blur : mergedDefaults.blur,
          };
        } catch (e) {
          console.error("Failed to parse background settings from localStorage", e);
          return mergedDefaults;
        }
      }
    }
    return mergedDefaults;
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKeyBackground, JSON.stringify(backgroundSettings));
    }
  }, [backgroundSettings, storageKeyBackground]);

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
    backgroundSettings,
    setBackgroundSettings: (newSettings: Partial<BackgroundSettings>) => {
      setBackgroundSettingsState(prev => ({ ...prev, ...newSettings }));
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