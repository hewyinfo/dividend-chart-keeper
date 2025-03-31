
import React from "react";
import { Download, CircleDollarSign, Plus, Search, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onExportCsv: () => void;
  onAddCash: () => void;
  onAddDividend: () => void;
  onFilterBySafetyScore?: (minScore: number) => void;
  showSafetyScoreFilter?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  onExportCsv,
  onAddCash,
  onAddDividend,
  onFilterBySafetyScore,
  showSafetyScoreFilter = false,
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ticker or notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {showSafetyScoreFilter && onFilterBySafetyScore && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Shield className="h-4 w-4" />
                <span>Safety Score</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onFilterBySafetyScore(0)}>
                  All Scores
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterBySafetyScore(75)}>
                  High (75+)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterBySafetyScore(50)}>
                  Medium (50+)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterBySafetyScore(25)}>
                  Low (25+)
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <div className="flex items-center gap-2 self-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onExportCsv}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export CSV</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onAddCash}
          className="gap-2"
        >
          <CircleDollarSign className="h-4 w-4" />
          <span>Add Cash</span>
        </Button>
        
        <Button
          onClick={onAddDividend}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Dividend</span>
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
