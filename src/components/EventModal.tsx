
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
  initialEvent?: DividendEvent;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSubmit, initialEvent }) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <EventModalForm onSubmit={onSubmit} initialEvent={initialEvent}>
      {({ form, handleSelectStock, handleSubmit }) => (
        <>
          <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <EventModalContent
              form={form}
              onClose={onClose}
              onSearchClick={() => setIsSearchModalOpen(true)}
              onSubmit={handleSubmit}
              isEditing={!!initialEvent}
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
