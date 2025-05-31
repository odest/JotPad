import { useRef, useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/core';
import { getVersion } from '@tauri-apps/api/app';
import { toast } from "sonner"
import { exportAllNotes } from "@repo/ui/lib/exportNotes";
import { useTheme } from "@repo/ui/providers/theme-provider";
import { exportFormats, ExportFormat } from "@repo/ui/components/note/ExportNoteDialog";
import { compareVersions, checkOnline, fetchLatestGithubVersion } from '@repo/ui/lib/utils';

type SortType = 'az' | 'za' | 'newest' | 'oldest';

export function useSettings() {
  const {
    themeSetting,
    setTheme,
    colorTheme,
    setColorTheme,
    backgroundSettings,
    setBackgroundSettings
  } = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAppearanceExpanded, setIsAppearanceExpanded] = useState(false);
  const [isBackgroundExpanded, setIsBackgroundExpanded] = useState(false);
  const [isExportExpanded, setIsExportExpanded] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [autoCheckUpdates, setAutoCheckUpdatesState] = useState(false);

  const [selectedExportFormat, setSelectedExportFormat] = useState<ExportFormat>("json");
  const [sortType, setSortTypeState] = useState<SortType>("newest");
  const [loaded, setLoaded] = useState(false);
  const currentExportFormatDisplay = exportFormats.find(f => f.value === selectedExportFormat)!;

  const defaultSettings = {
    theme: "system",
    color_theme: "zinc",
    background: {
      show_background: true,
      use_custom_image: false,
      custom_image_src: null,
      opacity: 30,
      brightness: 100,
      blur: 0,
    },
    export_format: "json",
    sort_type: "newest",
    auto_check_updates: false
  };

  const resetSettings = async () => {
    try {
      await invoke('write_settings', { settings: defaultSettings });
      window.location.reload();
    } catch (e) {
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const settings = await invoke<any>('read_settings');
        if (settings.export_format) {
          setSelectedExportFormat(settings.export_format);
        }
        if (settings.sort_type) {
          setSortTypeState(settings.sort_type);
        }
        if (settings.auto_check_updates) {
          setAutoCheckUpdatesState(settings.auto_check_updates);
        }
        setLoaded(true);
      } catch (e) {
        setLoaded(true);
      }
    })();
  }, []);

  const setSelectedExportFormatAndPersist = (format: ExportFormat) => {
    setSelectedExportFormat(format);
    (async () => {
      try {
        const settings = await invoke<any>('read_settings');
        await invoke('write_settings', {
          settings: {
            ...settings,
            export_format: format,
          }
        });
      } catch (e) {}
    })();
  };

  const setSortTypeAndPersist = (newSort: SortType) => {
    setSortTypeState(newSort);
    (async () => {
      try {
        const settings = await invoke<any>('read_settings');
        await invoke('write_settings', {
          settings: {
            ...settings,
            sort_type: newSort,
          }
        });
      } catch (e) {}
    })();
  };

  const setThemeAndPersist = (newTheme: string) => {
    setTheme(newTheme as any);
    (async () => {
      try {
        const settings = await invoke<any>('read_settings');
        await invoke('write_settings', {
          settings: {
            ...settings,
            theme: newTheme,
          }
        });
      } catch (e) {}
    })();
  };

  const handleCustomImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundSettings({
          custom_image_src: reader.result as string,
          use_custom_image: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCustomImage = () => {
    setBackgroundSettings({
      custom_image_src: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const handleExportNotes = async () => {
    await invoke('log_message', { level: 'info', message: `Attempting to export notes. Format: ${selectedExportFormat}` });
    try {
      const result = await exportAllNotes(selectedExportFormat);
      if (result === "success") {
        await invoke('log_message', { level: 'info', message: `Notes successfully exported. Format: ${selectedExportFormat}`});
        toast.success("Notes exported successfully.");
      } else if (result === "error") {
        toast.error("Export failed. Please try again.");
      }
    } catch (error: any) {
      await invoke('log_message', { level: 'error', message: `Export failed for notes with format ${selectedExportFormat}:`, error });
      toast.error("Export failed. Please try again.");
    }
  };

  const setAutoCheckUpdates = (checked: boolean) => {
    setAutoCheckUpdatesState(checked);
    (async () => {
      try {
        const settings = await invoke<any>('read_settings');
        await invoke('write_settings', {
          settings: {
            ...settings,
            auto_check_updates: checked,
          }
        });
      } catch (e) {}
    })();
  };

  const handleCheckForUpdates = async () => {
    if (!checkOnline()) {
      toast.error('No internet connection. Please check your network and try again.');
      return;
    }
    let currentVersion = '';
    try {
      currentVersion = await getVersion();
    } catch {
      toast.error('Could not determine current app version.');
      return;
    }
    try {
      const latestTag = await fetchLatestGithubVersion();
      const current = currentVersion.replace(/^v/, '');
      if (!latestTag) {
        toast.error('Could not determine latest version.');
        return;
      }
      const cmp = compareVersions(current, latestTag);
      if (cmp === 0) {
        toast.success('You are using the latest version.');
      } else if (cmp < 0) {
        toast.info(`A new version is available: v${latestTag}\nYou are using: v${current}`);
      } else {
        toast.success(`You are using a newer version (v${current}) than the latest release (v${latestTag}).`);
      }
    } catch (e) {
      toast.error('Failed to check for updates. Please try again later.');
    }
  };

  return {
    resetSettings,
    themeSetting,
    setTheme,
    setThemeAndPersist,
    colorTheme,
    setColorTheme,
    backgroundSettings,
    setBackgroundSettings,
    fileInputRef,
    isAppearanceExpanded, setIsAppearanceExpanded,
    isBackgroundExpanded, setIsBackgroundExpanded,
    isExportExpanded, setIsExportExpanded,
    isAboutExpanded, setIsAboutExpanded,
    autoCheckUpdates, setAutoCheckUpdates,
    selectedExportFormat, setSelectedExportFormat: setSelectedExportFormatAndPersist,
    currentExportFormatDisplay,
    sortType, setSortType: setSortTypeAndPersist,
    setSortTypeState,
    handleCustomImageChange,
    handleRemoveCustomImage,
    handleKeyDown,
    handleExportNotes,
    exportFormats,
    handleCheckForUpdates
  };
} 