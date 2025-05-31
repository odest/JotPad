import { convertFileSrc } from '@tauri-apps/api/core';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@repo/ui/components/card";
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@repo/ui/components/tooltip";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { Button } from "@repo/ui/components/button";
import { Switch } from "@repo/ui/components/switch";
import { Slider } from "@repo/ui/components/slider";
import { Separator } from "@repo/ui/components/separator";
import {
  Sun,
  Eye,
  Moon,
  Blend,
  Check,
  Trash2,
  Laptop,
  Download,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  UploadCloud,
  ChevronRight,
} from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { useSettings } from "@repo/ui/hooks/useSettings";
import { useState, useEffect } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { projectLinks } from "@repo/ui/lib/projectLinks";

interface SettingsProps {
  onClose: () => void;
  SIDEBAR_HEADER_HEIGHT: number;
}

const availableColorThemes: Array<{ name: "zinc" | "red" | "rose" | "orange" | "green" | "blue" | "yellow" | "violet"; label: string; previewColor: string }> = [
  { name: "zinc", label: "Default", previewColor: "hsl(240, 5%, 34%)" },
  { name: "red", label: "Red", previewColor: "hsl(0, 72%, 51%)" },
  { name: "rose", label: "Rose", previewColor: "hsl(347, 77%, 50%)" },
  { name: "orange", label: "Orange", previewColor: "hsl(21, 90%, 48%)" },
  { name: "green", label: "Green", previewColor: "hsl(142, 71%, 45%)" },
  { name: "blue", label: "Blue", previewColor: "hsl(217, 91%, 60%)" },
  { name: "yellow", label: "Yellow", previewColor: "hsl(48, 96%, 53%)" },
  { name: "violet", label: "Violet", previewColor: "hsl(263, 70%, 50%)" },
];

export function Settings({ onClose, SIDEBAR_HEADER_HEIGHT }: SettingsProps) {
  const {
    resetSettings,
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
    isAboutExpanded, setIsAboutExpanded,
    selectedExportFormat, setSelectedExportFormat,
    currentExportFormatDisplay,
    handleCustomImageChange,
    handleRemoveCustomImage,
    handleKeyDown,
    handleExportNotes,
    exportFormats,
    autoCheckUpdates, setAutoCheckUpdates,
    handleCheckForUpdates
  } = useSettings();

  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [appVersion, setAppVersion] = useState<string | null>(null);

  useEffect(() => {
    getVersion().then(setAppVersion).catch(() => setAppVersion("-"));
  }, []);

  const getCurrentThemeDisplay = () => {
    switch (themeSetting) {
      case "light": return { name: "Light", Icon: Sun };
      case "dark": return { name: "Dark", Icon: Moon };
      case "system": return { name: "System", Icon: Laptop };
      default: return { name: "System", Icon: Laptop };
    }
  };
  const currentThemeDisplay = getCurrentThemeDisplay();

  return (
    <div className={`relative flex-1 flex flex-col h-[calc(100vh)] md:h-[calc(100vh-2.5rem)] md:border md:m-5 md:mb-5 rounded-xl overflow-hidden bg-background`}>
      <div
        className="flex items-center px-4 py-3 border-b shrink-0"
        style={{ height: SIDEBAR_HEADER_HEIGHT, minHeight: SIDEBAR_HEADER_HEIGHT }}
      >
        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2 h-8 w-8 md:hidden">
          <ArrowLeft className="h-4 w-4" /> <span className="sr-only">Back</span>
        </Button>
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">

        <Card>
          <CardHeader
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsAppearanceExpanded(!isAppearanceExpanded)}
            onKeyDown={(e) => handleKeyDown(e, () => setIsAppearanceExpanded(!isAppearanceExpanded))}
            role="button"
            aria-expanded={isAppearanceExpanded}
            aria-controls="appearance-content"
            tabIndex={0}
          >
            <div>
              <CardTitle className="text-base">Appearance</CardTitle>
              <CardDescription className="text-sm">Customize the look and feel.</CardDescription>
            </div>
            {isAppearanceExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            )}
          </CardHeader>
          {isAppearanceExpanded && (
            <CardContent id="appearance-content" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Theme Mode</Label>
                  <p className="text-xs text-muted-foreground">Light, dark, or system default</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="outline" size="sm" className="w-[130px] justify-start">
                      <currentThemeDisplay.Icon className="mr-2 h-3 w-3" />
                      <span className="text-sm">{currentThemeDisplay.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[130px]">
                    <DropdownMenuItem
                      onClick={() => setTheme("light")}
                      className={cn(currentThemeDisplay.name === "Light" && "bg-accent")}
                    >
                      <Sun className="mr-2 h-3 w-3" />
                      <span className="text-sm">Light</span>
                      {currentThemeDisplay.name === "Light" && <Check className="ml-auto h-3 w-3" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("dark")}
                      className={cn(currentThemeDisplay.name === "Dark" && "bg-accent")}
                    >
                      <Moon className="mr-2 h-3 w-3" />
                      <span className="text-sm">Dark</span>
                      {currentThemeDisplay.name === "Dark" && <Check className="ml-auto h-3 w-3" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("system")}
                      className={cn(currentThemeDisplay.name === "System" && "bg-accent")}
                    >
                      <Laptop className="mr-2 h-3 w-3" />
                      <span className="text-sm">System</span>
                      {currentThemeDisplay.name === "System" && <Check className="ml-auto h-3 w-3" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Accent Color</Label>
                <div className="grid grid-cols-8 gap-2">
                  <TooltipProvider delayDuration={100}>
                    {availableColorThemes.map((themeOpt) => (
                      <Tooltip key={themeOpt.name}>
                        <TooltipTrigger>
                          <Button
                            variant="outline"
                            size="icon"
                            className={cn(
                              "h-8 w-8 rounded-md p-0",
                              colorTheme === themeOpt.name && "border-2 border-primary"
                            )}
                            onClick={() => setColorTheme(themeOpt.name)}
                          >
                            <span
                              className={cn(
                                "flex h-5 w-5 items-center justify-center rounded-sm",
                                colorTheme === themeOpt.name && "border border-primary-foreground/50"
                              )}
                              style={{ backgroundColor: themeOpt.previewColor }}
                            >
                              {colorTheme === themeOpt.name && <Check className="h-3 w-3 text-primary-foreground" />}
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" sideOffset={5}>
                          <span className="text-xs">{themeOpt.label}</span>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsBackgroundExpanded(!isBackgroundExpanded)}
            onKeyDown={(e) => handleKeyDown(e, () => setIsBackgroundExpanded(!isBackgroundExpanded))}
            role="button"
            aria-expanded={isBackgroundExpanded}
            aria-controls="background-content"
            tabIndex={0}
          >
            <div>
              <CardTitle className="text-base">Background</CardTitle>
              <CardDescription className="text-sm">Customize note content background.</CardDescription>
            </div>
            {isBackgroundExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            )}
          </CardHeader>
          {isBackgroundExpanded && (
            <CardContent id="background-content" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Show Background</Label>
                  <p className="text-xs text-muted-foreground">Toggle background visibility</p>
                </div>
                <Switch
                  checked={backgroundSettings.show_background}
                  onCheckedChange={(checked) => setBackgroundSettings({ show_background: checked })}
                />
              </div>

              {backgroundSettings.show_background && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <Tabs
                      value={backgroundSettings.use_custom_image ? "custom" : "doodle"}
                      onValueChange={(value) => {
                        const isCustom = value === "custom";
                        setBackgroundSettings({ use_custom_image: isCustom });
                        if (isCustom && !backgroundSettings.use_custom_image) {
                          fileInputRef.current?.click();
                        }
                      }}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 h-10 bg-muted/50">
                        <TabsTrigger value="doodle" className="text-xs h-8 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
                          Default
                        </TabsTrigger>
                        <TabsTrigger value="custom" className="text-xs h-8 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm">
                          Custom
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="custom" className="mt-4 space-y-4">
                        <div
                          className={cn(
                            "relative border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                            "hover:border-primary/50 hover:bg-primary/5",
                            backgroundSettings.custom_image_src
                              ? "border-primary/30 bg-primary/10"
                              : "border-muted-foreground/25"
                          )}
                          onClick={handleCustomImageChange}
                        >
                          {backgroundSettings.custom_image_src ? (
                            <div className="relative group">
                              <div className="flex justify-center items-center p-2 min-h-[120px] rounded-lg overflow-hidden">
                                <img
                                  src={backgroundSettings.custom_image_src ? convertFileSrc(backgroundSettings.custom_image_src) : undefined}
                                  alt="Selected background"
                                  className="max-w-full max-h-[120px] object-contain rounded-md shadow-sm"
                                />
                              </div>
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <div className="text-white text-center">
                                  <UploadCloud className="h-6 w-6 mx-auto mb-1" />
                                  <p className="text-xs font-medium">Click to change</p>
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveCustomImage();
                                }}
                                className="absolute top-2 right-2 h-7 w-7 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 px-4">
                              <div className="rounded-full bg-muted p-3 mb-3">
                                <UploadCloud className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <p className="text-sm font-medium text-foreground mb-1">
                                Select Custom Image
                              </p>
                              <p className="text-xs text-muted-foreground text-center">
                                Click to browse
                                <br />
                                PNG, JPG, GIF, WEBP supported
                              </p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                    <Separator />
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Effects</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center text-xs">
                            <Eye className="mr-1 h-3 w-3" /> Opacity
                          </Label>
                          <span className="text-xs text-muted-foreground">{backgroundSettings.opacity}%</span>
                        </div>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[backgroundSettings.opacity]}
                          onValueChange={([value]) => setBackgroundSettings({ opacity: value })}
                          className="h-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center text-xs">
                            <Sparkles className="mr-1 h-3 w-3" /> Brightness
                          </Label>
                          <span className="text-xs text-muted-foreground">{backgroundSettings.brightness}%</span>
                        </div>
                        <Slider
                          min={0}
                          max={200}
                          step={1}
                          value={[backgroundSettings.brightness]}
                          onValueChange={([value]) => setBackgroundSettings({ brightness: value })}
                          className="h-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center text-xs">
                            <Blend className="mr-1 h-3 w-3" /> Blur
                          </Label>
                          <span className="text-xs text-muted-foreground">{backgroundSettings.blur}px</span>
                        </div>
                        <Slider
                          min={0}
                          max={10}
                          step={0.1}
                          value={[backgroundSettings.blur]}
                          onValueChange={([value]) => setBackgroundSettings({ blur: value })}
                          className="h-1"
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Preview</Label>
                      <div className="relative rounded-md border bg-background p-3 h-32 overflow-hidden flex items-center justify-center">
                        <div
                          className="absolute inset-0 bg-center bg-no-repeat"
                          style={{
                            backgroundImage: backgroundSettings.use_custom_image && backgroundSettings.custom_image_src
                              ? `url(${convertFileSrc(backgroundSettings.custom_image_src)})`
                              : 'url(/background.png)',
                            opacity: backgroundSettings.opacity / 100,
                            filter: `brightness(${backgroundSettings.brightness / 100}) blur(${backgroundSettings.blur}px)`,
                          }}
                        />
                        <div className="relative z-[1] bg-muted p-2 rounded-lg shadow-sm max-w-[80%]">
                          <p className="text-xs">Sample note entry</p>
                          <p className="text-[10px] text-muted-foreground/80 mt-1 text-right">10:30</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsExportExpanded(!isExportExpanded)}
            onKeyDown={(e) => handleKeyDown(e, () => setIsExportExpanded(!isExportExpanded))}
            role="button"
            aria-expanded={isExportExpanded}
            aria-controls="export-content"
            tabIndex={0}
          >
            <div>
              <CardTitle className="text-base">Export Notes</CardTitle>
              <CardDescription className="text-sm">Save your notes in various formats.</CardDescription>
            </div>
            {isExportExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            )}
          </CardHeader>
          {isExportExpanded && (
            <CardContent id="export-content" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Export Format</Label>
                  <p className="text-xs text-muted-foreground">Choose the format for your notes.</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="outline" size="sm" className="w-[150px] justify-start">
                      <currentExportFormatDisplay.Icon className="mr-2 h-3 w-3" />
                      <span className="text-sm">{currentExportFormatDisplay.label}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[150px]">
                    {exportFormats.map((format) => (
                      <DropdownMenuItem
                        key={format.value}
                        onClick={() => setSelectedExportFormat(format.value)}
                        className={cn(selectedExportFormat === format.value && "bg-accent")}
                      >
                        <format.Icon className="mr-2 h-3 w-3" />
                        <span className="text-sm">{format.label}</span>
                        {selectedExportFormat === format.value && <Check className="ml-auto h-3 w-3" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Separator />

              <Button onClick={handleExportNotes} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export All Notes as {currentExportFormatDisplay.label}
              </Button>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
            onKeyDown={(e) => handleKeyDown(e, () => setIsAboutExpanded(!isAboutExpanded))}
            role="button"
            aria-expanded={isAboutExpanded}
            aria-controls="about-content"
            tabIndex={0}
          >
            <div>
              <CardTitle className="text-base">About</CardTitle>
              <CardDescription className="text-sm">App information and updates.</CardDescription>
            </div>
            {isAboutExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            )}
          </CardHeader>
          {isAboutExpanded && (
            <CardContent id="about-content" className="space-y-4">
              <div className="flex flex-col gap-2">
                {projectLinks.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <item.icon className="w-4 h-4" /> {item.label}
                    </span>
                    {item.value === "version" ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline text-primary"
                      >
                        v{appVersion ?? "..."}
                      </a>
                    ) : item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline text-primary"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium">
                  Check for updates on startup
                </span>
                <Switch
                  checked={autoCheckUpdates}
                  onCheckedChange={(checked) => setAutoCheckUpdates(checked)}
                />
              </div>
              <Separator />
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={async () => {
                  setCheckingUpdate(true);
                  await handleCheckForUpdates();
                  setCheckingUpdate(false);
                }}
              >
                {checkingUpdate ? (
                  <RefreshCw className="animate-spin h-4 w-4" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Check for Updates
              </Button>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader
            className="flex items-center justify-between"
          >
            <div>
              <CardTitle className="text-base">Reset Preferences</CardTitle>
              <CardDescription className="text-sm">
                This will reset all your user preferences to their defaults.
              </CardDescription>
            </div>
            <Button variant="destructive" onClick={resetSettings}>
              Reset to Defaults
            </Button>
          </CardHeader>
        </Card>

      </div>
    </div>
  );
}