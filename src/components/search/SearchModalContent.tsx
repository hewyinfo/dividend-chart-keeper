
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StockData } from "@/types/dividend";
import SearchForm from "./SearchForm";
import SearchResultsList from "./SearchResultsList";
import StockDetailsCard from "./StockDetailsCard";

interface SearchModalContentProps {
  query: string;
  searchResults: any[];
  selectedStock: StockData | null;
  isLoading: boolean;
  handleSearch: (data: { query: string }) => void;
  handleQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectTicker: (ticker: string) => void;
  handleRefresh: () => void;
  handleUseData: () => void;
}

const SearchModalContent = ({
  query,
  searchResults,
  selectedStock,
  isLoading,
  handleSearch,
  handleQueryChange,
  handleSelectTicker,
  handleRefresh,
  handleUseData
}: SearchModalContentProps) => {
  return (
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
};

export default SearchModalContent;
