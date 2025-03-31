
import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import SearchTickerModal from "./SearchTickerModal";
import EventModalContent from "./dividend/EventModalContent";
import EventModalForm from "./dividend/EventModalForm";
import { DividendEvent } from "@/types/dividend";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DividendEvent) => void;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <EventModalForm onSubmit={onSubmit}>
      {({ form, handleSelectStock, handleSubmit }) => (
        <>
          <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <EventModalContent
              form={form}
              onClose={onClose}
              onSearchClick={() => setIsSearchModalOpen(true)}
              onSubmit={handleSubmit}
            />
          </Dialog>

          <SearchTickerModal 
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
            onSelectStock={handleSelectStock}
          />
        </>
      )}
    </EventModalForm>
  );
};

export default EventModal;
