
import React from "react";
import { StockData } from "@/types/dividend";
import { useIsMobile } from "@/hooks/use-mobile";
import { useStockSearch } from "@/hooks/use-stock-search";
import MobileSearchModal from "./search/MobileSearchModal";
import DesktopSearchModal from "./search/DesktopSearchModal";

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

  const contentProps = {
    query,
    searchResults,
    selectedStock,
    isLoading,
    handleSearch,
    handleQueryChange,
    handleSelectTicker,
    handleRefresh,
    handleUseData
  };

  if (isMobile) {
    return (
      <MobileSearchModal 
        isOpen={isOpen} 
        onClose={onClose} 
        contentProps={contentProps} 
      />
    );
  }

  return (
    <DesktopSearchModal 
      isOpen={isOpen} 
      onClose={onClose} 
      contentProps={contentProps} 
    />
  );
};

export default SearchTickerModal;
