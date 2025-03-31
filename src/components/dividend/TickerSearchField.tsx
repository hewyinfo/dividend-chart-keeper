
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormSchema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface TickerSearchFieldProps {
  form: UseFormReturn<EventFormValues>;
  onSearchClick: () => void;
  disabled?: boolean;
}

const TickerSearchField: React.FC<TickerSearchFieldProps> = ({ form, onSearchClick, disabled = false }) => {
  return (
    <FormField
      control={form.control}
      name="ticker"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ticker Symbol</FormLabel>
          <div className="flex gap-2">
            <FormControl>
              <Input
                placeholder="AAPL"
                {...field}
                disabled={disabled}
                className="uppercase"
              />
            </FormControl>
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-1"
              onClick={onSearchClick}
              disabled={disabled}
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TickerSearchField;
