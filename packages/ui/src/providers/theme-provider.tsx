'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { useSettings } from "@repo/ui/hooks/useSettings";

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
  const [themeSetting, setThemeSetting] = useState<ThemeSetting>(defaultTheme);
  const [appliedTheme, setAppliedTheme] = useState<AppliedTheme>("light");
  const [colorTheme, setColorThemeState] = useState<ColorThemeName>(defaultColorTheme);
  const [backgroundSettings, setBackgroundSettingsState] = useState<BackgroundSettings>({
    ...defaultInitialBackgroundSettings,
    ...propDefaultBackgroundSettings,
  });
  const [loaded, setLoaded] = useState(false);
  const { sortType } = useSettings();

  useEffect(() => {
    (async () => {
      try {
        const settings = await invoke<any>('read_settings');
        setThemeSetting(settings.theme || defaultTheme);
        setColorThemeState(settings.color_theme || defaultColorTheme);
        setBackgroundSettingsState({
          ...defaultInitialBackgroundSettings,
          ...settings.background,
        });
        setLoaded(true);
      } catch (e) {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        const settings = await invoke<any>('read_settings');
        await invoke('write_settings', {
          settings: {
            ...settings,
            theme: themeSetting,
            color_theme: colorTheme,
            background: backgroundSettings,
          }
        });
      } catch (e) {
      }
    })();
  }, [themeSetting, colorTheme, backgroundSettings, loaded]);

  useEffect(() => {
    if (!loaded) return;
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
  }, [themeSetting, loaded]);

  useEffect(() => {
    if (!loaded) return;
    if (themeSetting !== "system") return;
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
  }, [themeSetting, loaded]);

  useEffect(() => {
    if (!loaded) return;
    const root = window.document.documentElement;
    if (colorTheme === "zinc" || !colorTheme) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", colorTheme);
    }
  }, [colorTheme, loaded]);

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

  if (!loaded) return null;

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