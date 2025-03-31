
import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Check, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ThemeOption = {
  name: string;
  value: string;
  color: string;
};

const themes: ThemeOption[] = [
  { name: "Default", value: "default", color: "#1831F2" },
  { name: "Green", value: "theme-green", color: "#22C55E" },
  { name: "Purple", value: "theme-purple", color: "#9333EA" },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [colorTheme, setColorTheme] = React.useState<string>("default");

  // Handle both the light/dark mode and color theme
  const handleThemeChange = (themeOption: ThemeOption) => {
    document.body.classList.remove("theme-blue", "theme-green", "theme-purple");
    
    if (themeOption.value !== "default") {
      document.body.classList.add(themeOption.value);
    }
    
    setColorTheme(themeOption.value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Change color theme"
          className="ml-2"
        >
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => handleThemeChange(themeOption)}
            className="flex items-center gap-2"
          >
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: themeOption.color }}
            />
            {themeOption.name}
            {colorTheme === themeOption.value && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
