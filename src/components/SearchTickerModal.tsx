
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { StockData } from "@/types/dividend";
import { useIsMobile } from "@/hooks/use-mobile";
import { useStockSearch } from "@/hooks/use-stock-search";
import SearchForm from "./search/SearchForm";
import SearchResultsList from "./search/SearchResultsList";
import StockDetailsCard from "./search/StockDetailsCard";

interface SearchTickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (stockData: StockData) => void;
}

const SearchTickerModal = ({ isOpen, onClose, onSelectStock }: SearchTickerModalProps) => {
  const isMobile = useIsMobile();
  const {
    query,
    searchResults,
    selectedStock,
    isLoading,
    handleSearch,
    handleQueryChange,
    handleSelectTicker,
    handleRefresh,
    setSelectedStock
  } = useStockSearch();

  const handleUseData = () => {
    if (selectedStock) {
      onSelectStock(selectedStock);
      onClose();
    }
  };

  const renderContent = () => (
    <div className="space-y-4">
      <SearchForm
        query={query}
        onQueryChange={handleQueryChange}
        onSubmit={handleSearch}
        isLoading={isLoading}
      />

      {isLoading && !selectedStock && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}

      {searchResults.length > 0 && !selectedStock && (
        <SearchResultsList
          results={searchResults}
          onSelectTicker={handleSelectTicker}
        />
      )}

      {selectedStock && (
        <StockDetailsCard
          stock={selectedStock}
          onRefresh={handleRefresh}
          onUseData={handleUseData}
        />
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-md overflow-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Search for Dividend Stock</SheetTitle>
          </SheetHeader>
          {renderContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Search for Dividend Stock</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default SearchTickerModal;
