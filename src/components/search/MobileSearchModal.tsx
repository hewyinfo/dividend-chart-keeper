
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StockData } from "@/types/dividend";
import SearchModalContent from "./SearchModalContent";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentProps: {
    query: string;
    searchResults: any[];
    selectedStock: StockData | null;
    isLoading: boolean;
    handleSearch: (data: { query: string }) => void;
    handleQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectTicker: (ticker: string) => void;
    handleRefresh: () => void;
    handleUseData: () => void;
  };
}

const MobileSearchModal = ({ isOpen, onClose, contentProps }: MobileSearchModalProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Search for Dividend Stock</SheetTitle>
        </SheetHeader>
        <SearchModalContent {...contentProps} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSearchModal;
