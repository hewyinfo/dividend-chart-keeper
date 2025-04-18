
import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./EventFormSchema";
import TickerSearchField from "./TickerSearchField";
import DatePickerFields from "./DatePickerFields";
import FinancialFields from "./FinancialFields";
import StatusFields from "./StatusFields";

interface EventModalContentProps {
  form: UseFormReturn<EventFormValues>;
  onClose: () => void;
  onSearchClick: () => void;
  onSubmit: (values: EventFormValues) => void;
  isEditing?: boolean;
}

const EventModalContent: React.FC<EventModalContentProps> = ({
  form,
  onClose,
  onSearchClick,
  onSubmit,
  isEditing = false
}) => {
  return (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto modal-animation-enter">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Dividend Event" : "Add Dividend Event"}</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TickerSearchField form={form} onSearchClick={onSearchClick} disabled={isEditing && form.getValues().ticker === "CASH"} />
          <DatePickerFields form={form} />
          <FinancialFields form={form} />
          <StatusFields form={form} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update" : "Add"} Event</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default EventModalContent;
