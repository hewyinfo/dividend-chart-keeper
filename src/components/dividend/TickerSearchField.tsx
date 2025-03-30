
import React from "react";
import { Search } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormSchema";

interface TickerSearchFieldProps {
  form: UseFormReturn<EventFormValues>;
  onSearchClick: () => void;
}

const TickerSearchField: React.FC<TickerSearchFieldProps> = ({ form, onSearchClick }) => {
  return (
    <div className="flex items-center gap-2">
      <FormField
        control={form.control}
        name="ticker"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Ticker Symbol</FormLabel>
            <FormControl>
              <Input placeholder="e.g. AAPL" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="pt-7">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSearchClick}
          className="flex items-center gap-1"
        >
          <Search size={16} />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>
    </div>
  );
};

export default TickerSearchField;
