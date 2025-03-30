
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DividendEvent, StockData } from "@/types/dividend";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import SearchTickerModal from "./SearchTickerModal";
import { eventFormSchema, EventFormValues } from "./dividend/EventFormSchema";
import TickerSearchField from "./dividend/TickerSearchField";
import DatePickerFields from "./dividend/DatePickerFields";
import FinancialFields from "./dividend/FinancialFields";
import StatusFields from "./dividend/StatusFields";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DividendEvent) => void;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      ticker: "",
      received: false,
      status: "Projected",
    },
  });

  const handleSubmit = (data: EventFormValues) => {
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
              <TickerSearchField form={form} onSearchClick={() => setIsSearchModalOpen(true)} />
              <DatePickerFields form={form} />
              <FinancialFields form={form} />
              <StatusFields form={form} />

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
