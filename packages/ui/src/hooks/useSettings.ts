import { useRef, useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/core';
import { exportAllNotes } from "@repo/ui/lib/exportNotes";
import { useTheme } from "@repo/ui/providers/theme-provider";
import { exportFormats, ExportFormat } from "@repo/ui/components/note/ExportNoteDialog";

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

  const [selectedExportFormat, setSelectedExportFormat] = useState<ExportFormat>("json");
  const [sortType, setSortTypeState] = useState<SortType>("newest");
  const [loaded, setLoaded] = useState(false);
  const currentExportFormatDisplay = exportFormats.find(f => f.value === selectedExportFormat)!;

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
        await invoke('write_settings', {
          settings: {
            theme: themeSetting,
            color_theme: colorTheme,
            background: backgroundSettings,
            export_format: selectedExportFormat,
            sort_type: sortType,
          }
        });
      } catch (e) {}
    })();
  }, [selectedExportFormat, sortType, themeSetting, colorTheme, backgroundSettings, loaded]);

  const setThemeAndPersist = (newTheme: string) => {
    setTheme(newTheme as any);
    (async () => {
      try {
        await invoke('write_settings', {
          settings: {
            theme: newTheme,
            color_theme: colorTheme,
            background: backgroundSettings,
            export_format: selectedExportFormat,
            sort_type: sortType,
          }
        });
      } catch (e) {}
    })();
  };

  const setSortType = (newSort: SortType) => {
    setSortTypeState(newSort);
    (async () => {
      try {
        await invoke('write_settings', {
          settings: {
            theme: themeSetting,
            color_theme: colorTheme,
            background: backgroundSettings,
            export_format: selectedExportFormat,
            sort_type: newSort,
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
          customImageSrc: reader.result as string,
          useCustomImage: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCustomImage = () => {
    setBackgroundSettings({
      customImageSrc: null,
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
      await exportAllNotes(selectedExportFormat);
      await invoke('log_message', { level: 'info', message: `Notes successfully exported. Format: ${selectedExportFormat}`});
    } catch (error) {
      await invoke('log_message', { level: 'error', message: `Export failed for notes with format ${selectedExportFormat}:`, error });
      alert("Export failed. Please try again.");
    }
  };

  return {
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
    selectedExportFormat, setSelectedExportFormat,
    currentExportFormatDisplay,
    sortType, setSortType,
    setSortTypeState,
    handleCustomImageChange,
    handleRemoveCustomImage,
    handleKeyDown,
    handleExportNotes,
    exportFormats
  };
} 