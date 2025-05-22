import { ArrowLeft, Sun, Moon, Laptop, Check } from "lucide-react";
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
  const { themeSetting, setTheme, appliedTheme, colorTheme, setColorTheme } = useTheme();

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
    <div className="flex-1 flex flex-col h-[calc(100vh)] md:h-[calc(100vh-2.5rem)] md:border md:m-5 md:mb-5 rounded-xl ${!showSidebar ? 'block' : 'hidden md:block'} bg-background">
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
      </div>
    </div>
  );
}