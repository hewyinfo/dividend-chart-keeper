
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { SecuritySearchResult, StockData } from "@/types/dividend";
import { searchSecurities, getStockData } from "@/services/intrinioService";

export function useStockSearch() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SecuritySearchResult[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleSearch = async (formData: { query: string }) => {
    const searchQuery = formData.query.trim();
    if (searchQuery.length < 2) return;
    
    try {
      setIsLoading(true);
      const results = await searchSecurities(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Could not search for securities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (value.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => handleSearch({ query: value }), 500);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectTicker = async (ticker: string) => {
    try {
      setIsLoading(true);
      setSearchResults([]);
      const data = await getStockData(ticker);
      
      if (data) {
        setSelectedStock(data);
      } else {
        toast({
          title: "Data Not Found",
          description: `Could not retrieve dividend data for ${ticker}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get stock data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedStock) handleSelectTicker(selectedStock.ticker);
  };

  return {
    query,
    searchResults,
    selectedStock,
    isLoading,
    handleSearch,
    handleQueryChange,
    handleSelectTicker,
    handleRefresh,
    setSelectedStock
  };
}
