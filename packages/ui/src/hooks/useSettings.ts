import { useRef, useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { getVersion } from '@tauri-apps/api/app';
import { useTranslation } from 'react-i18next';
import i18n from '@repo/ui/lib/i18n';
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
  const { t } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAppearanceExpanded, setIsAppearanceExpanded] = useState(false);
  const [isBackgroundExpanded, setIsBackgroundExpanded] = useState(false);
  const [isExportExpanded, setIsExportExpanded] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isPrivacyExpanded, setIsPrivacyExpanded] = useState(false);
  const [autoCheckUpdates, setAutoCheckUpdatesState] = useState(false);
  const [linkPreviewEnabled, setLinkPreviewEnabledState] = useState(false);

  const [selectedExportFormat, setSelectedExportFormat] = useState<ExportFormat>("json");
  const [sortType, setSortTypeState] = useState<SortType>("newest");
  const [loaded, setLoaded] = useState(false);
  const currentExportFormatDisplay = exportFormats.find(f => f.value === selectedExportFormat)!;

  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const availableLanguages = [
    { code: 'ar', name: t('arabic') },
    { code: 'de', name: t('german') },
    { code: 'en', name: t('english') },
    { code: 'es', name: t('spanish') },
    { code: 'fr', name: t('french') },
    { code: 'hi', name: t('hindi') },
    { code: 'ja', name: t('japanese') },
    { code: 'ru', name: t('russian') },
    { code: 'tr', name: t('turkish') },
    { code: 'zh', name: t('chinese') },
  ];

  const defaultSettings = {
    language: 'en',
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
    auto_check_updates: false,
    link_preview_enabled: false
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
        if (settings.language) {
          setSelectedLanguage(settings.language);
          i18n.changeLanguage(settings.language);
        }
        if (settings.export_format) {
          setSelectedExportFormat(settings.export_format);
        }
        if (settings.sort_type) {
          setSortTypeState(settings.sort_type);
        }
        if (settings.auto_check_updates) {
          setAutoCheckUpdatesState(settings.auto_check_updates);
        }
        if (settings.link_preview_enabled) {
          setLinkPreviewEnabledState(settings.link_preview_enabled);
        }
        setLoaded(true);
      } catch (e) {
        setLoaded(true);
      }
    })();
  }, []);

  const setSelectedLanguageAndPersist = (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    (async () => {
      try {
        const settings = await invoke<any>('read_settings');
        await invoke('write_settings', {
          settings: {
            ...settings,
            language: lang,
          }
        });
      } catch (e) {}
    })();
  };

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

  const handleCustomImageChange = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }
        ]
      });
      if (typeof selected === 'string') {
        setBackgroundSettings({
          custom_image_src: selected,
          use_custom_image: true,
        });
      }
    } catch (e) {
      toast.error(t('failed_to_select_image'));
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
        toast.success(t('notes_exported_successfully'));
      } else if (result === "error") {
        toast.error(t('export_failed'));
      }
    } catch (error: any) {
      await invoke('log_message', { level: 'error', message: `Export failed for notes with format ${selectedExportFormat}:`, error });
      toast.error(t('export_failed'));
    }
  };

  const setLinkPreviewEnabled = (enabled: boolean) => {
    setLinkPreviewEnabledState(enabled);
    (async () => {
      try {
        const settings = await invoke<any>('read_settings');
        await invoke('write_settings', {
          settings: {
            ...settings,
            link_preview_enabled: enabled,
          }
        });
      } catch (e) {}
    })();
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
      toast.error(t('no_internet_connection'));
      return;
    }
    let currentVersion = '';
    try {
      currentVersion = await getVersion();
    } catch {
      toast.error(t('could_not_determine_current_version'));
      return;
    }
    try {
      const latestTag = await fetchLatestGithubVersion();
      const current = currentVersion.replace(/^v/, '');
      if (!latestTag) {
        toast.error(t('could_not_determine_latest_version'));
        return;
      }
      const cmp = compareVersions(current, latestTag);
      if (cmp === 0) {
        toast.success(t('you_are_using_the_latest_version'));
      } else if (cmp < 0) {
        toast.info(t('a_new_version_is_available', {
          latestTag: `${latestTag}`,
          current:   `${current}`
        }));
      } else {
        toast.success(t('you_are_using_a_newer_version', {
          current: `${current}`,
          latestTag: `${latestTag}`
        }));
      }
    } catch (e) {
      toast.error(t('failed_to_check_for_updates'));
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
    isPrivacyExpanded, setIsPrivacyExpanded,
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
    handleCheckForUpdates,
    linkPreviewEnabled, setLinkPreviewEnabled,
    selectedLanguage, setSelectedLanguage: setSelectedLanguageAndPersist,
    availableLanguages
  };
} 