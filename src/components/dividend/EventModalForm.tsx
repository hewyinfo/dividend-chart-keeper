
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StockData, DividendEvent } from "@/types/dividend";
import { eventFormSchema, EventFormValues } from "./EventFormSchema";
import { useAuth } from "@/contexts/AuthContext";

interface EventModalFormProps {
  onSubmit: (data: DividendEvent) => void;
  initialEvent?: DividendEvent;
  children: (props: {
    form: ReturnType<typeof useForm<EventFormValues>>;
    handleSelectStock: (stockData: StockData) => void;
    handleSubmit: (data: EventFormValues) => void;
  }) => React.ReactNode;
}

const EventModalForm: React.FC<EventModalFormProps> = ({ onSubmit, initialEvent, children }) => {
  const { user } = useAuth();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      ticker: "",
      received: false,
      status: "Projected",
    },
  });

  // Set form values when editing an existing event
  useEffect(() => {
    if (initialEvent) {
      form.reset({
        ticker: initialEvent.ticker,
        exDate: new Date(initialEvent.exDate),
        payDate: initialEvent.payDate ? new Date(initialEvent.payDate) : undefined,
        yield: initialEvent.yield,
        received: initialEvent.received,
        amount: initialEvent.amount,
        status: initialEvent.status || "Projected",
        notes: initialEvent.notes,
        yieldOnCost: initialEvent.yieldOnCost,
        price: initialEvent.price,
      });
    }
  }, [initialEvent, form]);

  const handleSubmit = (data: EventFormValues) => {
    onSubmit({
      ...initialEvent, // Include original ID and other fields when editing
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
      user_id: user?.id,
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

  return <>{children({ form, handleSelectStock, handleSubmit })}</>;
};

export default EventModalForm;
