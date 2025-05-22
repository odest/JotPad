import { ArrowLeft, Sun, Moon, Laptop, Check, Image as ImageIcon, Eye, Sparkles, Blend, UploadCloud, Trash2, Palette } from "lucide-react";
import { Label } from "@repo/ui/components/label";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { useTheme } from "@repo/ui/components/theme-provider";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@repo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@repo/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/lib/utils";
import { Switch } from "@repo/ui/components/switch";
import { Slider } from "@repo/ui/components/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import React, { useRef } from "react";

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
    themeSetting,
    setTheme,
    colorTheme,
    setColorTheme,
    backgroundSettings,
    setBackgroundSettings
  } = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        className="flex items-center p-4 border-b shrink-0"
        style={{ height: SIDEBAR_HEADER_HEIGHT, minHeight: SIDEBAR_HEADER_HEIGHT }}
      >
        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2 h-9 w-9 md:hidden">
          <ArrowLeft className="h-5 w-5" /> <span className="sr-only">Back</span>
        </Button>
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <Separator className="my-2" />
          <CardContent>
            <div className="flex items-center justify-between space-x-2 py-2">
              <Label htmlFor="theme-dropdown" className="flex flex-col space-y-1">
                <span>Mode</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Select light, dark, or system default mode.
                </span>
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" id="theme-dropdown" className="w-[160px] justify-start">
                    <currentThemeDisplay.Icon className="mr-2 h-4 w-4" />
                    {currentThemeDisplay.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" /> <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" /> <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Laptop className="mr-2 h-4 w-4" /> <span>System</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Accent Color</CardTitle>
            <CardDescription>Choose an accent color for the application.</CardDescription>
          </CardHeader>
          <Separator className="my-2" />
          <CardContent>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-8">
              <TooltipProvider delayDuration={100}>
                {availableColorThemes.map((themeOpt) => (
                  <Tooltip key={themeOpt.name}>
                    <TooltipTrigger>
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          "h-12 w-12 rounded-lg p-0 md:h-10 md:w-10",
                          colorTheme === themeOpt.name && "border-2 border-primary"
                        )}
                        onClick={() => setColorTheme(themeOpt.name)}
                        aria-label={`Set theme to ${themeOpt.label}`}
                      >
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-md md:h-6 md:w-6",
                            colorTheme === themeOpt.name && "border border-primary-foreground/50"
                          )}
                          style={{ backgroundColor: themeOpt.previewColor }}
                        >
                          {colorTheme === themeOpt.name && <Check className="h-5 w-5 text-primary-foreground" />}
                        </span>
                        <span className="sr-only">{themeOpt.label}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={5}>
                      {themeOpt.label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Note Content Background</CardTitle>
            <CardDescription>Customize the note content background appearance.</CardDescription>
          </CardHeader>
          <Separator className="my-2" />
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="show-background-switch" className="flex flex-col space-y-1">
                <span>Show Background Image</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Toggle the visibility of the background image.
                </span>
              </Label>
              <Switch
                id="show-background-switch"
                checked={backgroundSettings.showBackground}
                onCheckedChange={(checked) => setBackgroundSettings({ showBackground: checked })}
                aria-label="Toggle background image"
              />
            </div>

            {backgroundSettings.showBackground && (
              <>
                <Separator />

                <Tabs
                  value={backgroundSettings.useCustomImage ? "custom" : "doodle"}
                  onValueChange={(value) => {
                    const isCustom = value === "custom";
                    setBackgroundSettings({ useCustomImage: isCustom });
                    if (isCustom && !backgroundSettings.customImageSrc) {
                      fileInputRef.current?.click();
                    }
                  }}
                  className="w-full pt-2"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="doodle">
                      <Palette className="mr-2 h-4 w-4" /> Default Doodle
                    </TabsTrigger>
                    <TabsTrigger value="custom">
                      <ImageIcon className="mr-2 h-4 w-4" /> Custom Image
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="custom" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 justify-start text-left"
                        >
                          <UploadCloud className="mr-2 h-4 w-4 shrink-0" />
                          {backgroundSettings.customImageSrc ? "Change Image" : "Select Image..."}
                        </Button>
                        {backgroundSettings.customImageSrc && (
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={handleRemoveCustomImage}
                                  aria-label="Remove custom image"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" sideOffset={5}>
                                Remove Custom Image
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                    
                    {backgroundSettings.customImageSrc ? (
                      <div className="p-1 border rounded-md bg-muted/20 overflow-hidden flex justify-center items-center aspect-video max-h-48">
                        <img
                          src={backgroundSettings.customImageSrc}
                          alt="Custom background preview"
                          className="max-w-full max-h-full object-contain rounded-sm"
                        />
                      </div>
                    ) : (
                        <div className="text-sm text-muted-foreground text-center py-6 px-4 border border-dashed rounded-md">
                          No custom image selected.
                          <br/>
                          <span className="text-xs">(PNG, JPG, GIF, WEBP supported)</span>
                        </div>
                    )}
                    <input
                      type="file"
                      id="custom-background-input"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/gif, image/webp"
                      onChange={handleCustomImageChange}
                      className="hidden"
                    />
                  </TabsContent>
                </Tabs>

                <Separator />
                <div className="space-y-1 pt-4">
                    <Label className="text-sm font-medium">Background Effects</Label>
                    <span className="block text-xs font-normal leading-snug text-muted-foreground pb-2">
                        Adjust the opacity, brightness, and blur of the background.
                    </span>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="background-opacity-slider" className="flex items-center text-sm">
                    <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> Opacity
                    <span className="ml-auto text-muted-foreground">{backgroundSettings.opacity}%</span>
                  </Label>
                  <Slider
                    id="background-opacity-slider"
                    min={0}
                    max={100}
                    step={1}
                    value={[backgroundSettings.opacity]}
                    onValueChange={([value]) => setBackgroundSettings({ opacity: value })}
                    aria-label="Background opacity"
                    disabled={!backgroundSettings.showBackground}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="background-brightness-slider" className="flex items-center text-sm">
                    <Sparkles className="mr-2 h-4 w-4 text-muted-foreground" /> Brightness
                    <span className="ml-auto text-muted-foreground">{backgroundSettings.brightness}%</span>
                  </Label>
                  <Slider
                    id="background-brightness-slider"
                    min={0}
                    max={200}
                    step={1}
                    value={[backgroundSettings.brightness]}
                    onValueChange={([value]) => setBackgroundSettings({ brightness: value })}
                    aria-label="Background brightness"
                    disabled={!backgroundSettings.showBackground}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="background-blur-slider" className="flex items-center text-sm">
                    <Blend className="mr-2 h-4 w-4 text-muted-foreground" /> Blur
                    <span className="ml-auto text-muted-foreground">{backgroundSettings.blur}px</span>
                  </Label>
                  <Slider
                    id="background-blur-slider"
                    min={0}
                    max={10} 
                    step={0.1}
                    value={[backgroundSettings.blur]}
                    onValueChange={([value]) => setBackgroundSettings({ blur: value })}
                    aria-label="Background blur"
                    disabled={!backgroundSettings.showBackground}
                  />
                </div>

                <Separator />
                <div className="space-y-4 pt-2">
                  <Label className="text-sm font-medium">Preview</Label>
                  <div className="relative rounded-lg border bg-background p-4 h-48 overflow-hidden flex items-center justify-center">
                    <div
                      className="absolute inset-0 bg-center bg-no-repeat"
                      style={{
                        backgroundImage: backgroundSettings.useCustomImage && backgroundSettings.customImageSrc
                          ? `url(${backgroundSettings.customImageSrc})`
                          : 'url(/background.png)',
                        opacity: backgroundSettings.opacity / 100,
                        filter: `brightness(${backgroundSettings.brightness / 100}) blur(${backgroundSettings.blur}px)`,
                      }}
                    />
                    <div className="relative z-[1] bg-muted p-3 rounded-xl shadow-md max-w-[70%]">
                      <p className="text-sm">This is a sample note entry to preview the background.</p>
                      <p className="text-xs text-muted-foreground/80 mt-1 text-right">10:30</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}