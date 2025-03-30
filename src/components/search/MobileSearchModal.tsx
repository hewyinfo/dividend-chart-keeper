
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import SearchModalContent from "./SearchModalContent";
import { SearchModalContentProps } from "./SearchModalContent";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentProps: SearchModalContentProps;
}

const MobileSearchModal = ({ isOpen, onClose, contentProps }: MobileSearchModalProps) => (
  <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <SheetContent className="w-full sm:max-w-md overflow-auto">
      <SheetHeader className="mb-4">
        <SheetTitle>Search for Dividend Stock</SheetTitle>
      </SheetHeader>
      <SearchModalContent {...contentProps} />
    </SheetContent>
  </Sheet>
);

export default MobileSearchModal;
