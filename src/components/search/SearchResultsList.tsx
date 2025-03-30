
import React from "react";
import { SecuritySearchResult } from "@/types/dividend";

interface SearchResultsListProps {
  results: SecuritySearchResult[];
  onSelectTicker: (ticker: string) => void;
}

const SearchResultsList = ({ results, onSelectTicker }: SearchResultsListProps) => {
  if (results.length === 0) return null;

  return (
    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
      <div className="divide-y">
        {results.map((result) => (
          <div
            key={result.ticker}
            className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between"
            onClick={() => onSelectTicker(result.ticker)}
          >
            <div className="font-medium">{result.ticker}</div>
            <div className="text-gray-500 truncate">{result.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsList;
