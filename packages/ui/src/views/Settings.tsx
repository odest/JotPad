import { ArrowLeft } from "lucide-react";
import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
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

interface SettingsProps {
  onClose: () => void;
  SIDEBAR_HEADER_HEIGHT: number;
}

export function Settings({ onClose, SIDEBAR_HEADER_HEIGHT }: SettingsProps) {
  const { theme, setTheme } = useTheme();

  const toggleThemeSetting = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh)] md:h-[calc(100vh-2.5rem)] md:border md:m-5 md:mb-5 rounded-xl ${!showSidebar ? 'block' : 'hidden md:block'} bg-background">
      <div
        className="flex items-center p-4 border-b shrink-0"
        style={{ height: SIDEBAR_HEADER_HEIGHT, minHeight: SIDEBAR_HEADER_HEIGHT }}
      >
        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2 h-9 w-9 md:hidden">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
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
              <Label htmlFor="theme-mode" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Toggle between light and dark themes.
                </span>
              </Label>
              <Switch
                id="theme-mode"
                checked={theme === "dark"}
                onCheckedChange={toggleThemeSetting}
                aria-label="Toggle dark mode"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}