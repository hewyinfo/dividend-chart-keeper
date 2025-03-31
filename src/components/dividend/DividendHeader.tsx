
import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DividendHeaderProps {
  onOpenSettings?: () => void;
}

const DividendHeader: React.FC<DividendHeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="mb-8 flex flex-col items-center">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {onOpenSettings && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onOpenSettings}>
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>API Settings</TooltipContent>
          </Tooltip>
        )}
        <ThemeToggle />
      </div>
      <h1 className="text-3xl font-bold mb-2 text-center">Dividend Tracker</h1>
      <p className="text-muted-foreground text-center">
        Track and visualize your dividend investments
      </p>
    </header>
  );
};

export default DividendHeader;
