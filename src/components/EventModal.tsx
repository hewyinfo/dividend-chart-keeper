
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { DividendEvent, StockData } from "@/types/dividend";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SearchTickerModal from "./SearchTickerModal";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DividendEvent) => void;
}

const formSchema = z.object({
  ticker: z.string().min(1, "Ticker is required").max(10),
  exDate: z.date({
    required_error: "Ex-dividend date is required",
  }),
  payDate: z.date().optional(),
  yield: z.number().min(0).max(100).optional(),
  received: z.boolean().default(false),
  amount: z.number().min(0).optional(),
  status: z.enum(["Confirmed", "Projected"]).default("Projected"),
  notes: z.string().optional(),
  yieldOnCost: z.number().min(0).max(100).optional(),
  price: z.number().min(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "",
      received: false,
      status: "Projected",
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit({
      ticker: data.ticker,
      exDate: data.exDate.toISOString(),
      payDate: data.payDate ? data.payDate.toISOString() : undefined,
      yield: data.yield,
      received: data.received,
      amount: data.amount,
      status: data.status,
      notes: data.notes,
      yieldOnCost: data.yieldOnCost,
      price: data.price,
    });
    form.reset();
  };

  const handleSelectStock = (stockData: StockData) => {
    // Convert dates from string to Date objects for the form
    const exDate = stockData.exDivDate ? new Date(stockData.exDivDate) : undefined;
    const payDate = stockData.paymentDate ? new Date(stockData.paymentDate) : undefined;
    
    form.setValue("ticker", stockData.ticker);
    form.setValue("yield", stockData.dividendYield * 100); // Convert decimal to percentage
    form.setValue("amount", stockData.latestDividend);
    form.setValue("price", stockData.price);
    
    if (exDate && !isNaN(exDate.getTime())) {
      form.setValue("exDate", exDate);
    }
    
    if (payDate && !isNaN(payDate.getTime())) {
      form.setValue("payDate", payDate);
    }
    
    // Calculate and set yield on cost if possible
    if (stockData.price && stockData.latestDividend) {
      const annualDividend = stockData.latestDividend * 4; // Assuming quarterly dividends
      const yieldOnCost = (annualDividend / stockData.price) * 100;
      form.setValue("yieldOnCost", parseFloat(yieldOnCost.toFixed(2)));
    }
    
    form.setValue("status", "Projected");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto modal-animation-enter">
          <DialogHeader>
            <DialogTitle>Add Dividend Event</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                    onClick={() => setIsSearchModalOpen(true)}
                    className="flex items-center gap-1"
                  >
                    <Search size={16} />
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="exDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ex-Dividend Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "MMM dd, yyyy")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Pay Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "MMM dd, yyyy")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dividend Amount ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.0001" 
                          placeholder="e.g. 0.88" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value ? parseFloat(value) : undefined);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yield"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dividend Yield (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="e.g. 2.5" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value ? parseFloat(value) : undefined);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yieldOnCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yield on Cost (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="e.g. 3.2" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value ? parseFloat(value) : undefined);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Price at Purchase ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="e.g. 150.75" 
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseFloat(value) : undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Projected" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Projected
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Confirmed" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Confirmed
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="received"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-label="Mark as received"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Mark as Received</FormLabel>
                      <FormDescription>
                        Check if you've already received this dividend
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional notes about this dividend..." 
                        className="resize-none h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Add Event</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <SearchTickerModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectStock={handleSelectStock}
      />
    </>
  );
};

export default EventModal;
