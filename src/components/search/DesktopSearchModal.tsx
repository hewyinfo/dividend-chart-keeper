
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StockData } from "@/types/dividend";
import SearchModalContent from "./SearchModalContent";

interface DesktopSearchModalProps {
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

const DesktopSearchModal = ({ isOpen, onClose, contentProps }: DesktopSearchModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Search for Dividend Stock</DialogTitle>
        </DialogHeader>
        <SearchModalContent {...contentProps} />
      </DialogContent>
    </Dialog>
  );
};

export default DesktopSearchModal;
