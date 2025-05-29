import { useRef, useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import { exportAllNotes } from "@repo/ui/lib/exportNotes";
import { useTheme } from "@repo/ui/providers/theme-provider";
import { exportFormats, ExportFormat } from "@repo/ui/components/note/ExportNoteDialog";

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
  const currentExportFormatDisplay = exportFormats.find(f => f.value === selectedExportFormat)!;

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
    handleCustomImageChange,
    handleRemoveCustomImage,
    handleKeyDown,
    handleExportNotes,
    exportFormats
  };
} 