
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Search, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { SecuritySearchResult, StockData } from "@/types/dividend";
import { searchSecurities, getStockData } from "@/services/intrinioService";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";

interface SearchTickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (stockData: StockData) => void;
}

const SearchTickerModal = ({ isOpen, onClose, onSelectStock }: SearchTickerModalProps) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SecuritySearchResult[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { register, handleSubmit } = useForm<{ query: string }>();

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
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
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch({ query: value });
      }, 500);
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

  const handleUseData = () => {
    if (selectedStock) {
      onSelectStock(selectedStock);
      onClose();
    }
  };

  const handleRefresh = () => {
    if (selectedStock) {
      handleSelectTicker(selectedStock.ticker);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const renderContent = () => (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(handleSearch)} className="flex gap-2">
        <Input
          placeholder="Enter ticker symbol..."
          {...register("query")}
          value={query}
          onChange={handleQueryChange}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      {isLoading && !selectedStock && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}

      {searchResults.length > 0 && !selectedStock && (
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <div className="divide-y">
            {searchResults.map((result) => (
              <div
                key={result.ticker}
                className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between"
                onClick={() => handleSelectTicker(result.ticker)}
              >
                <div className="font-medium">{result.ticker}</div>
                <div className="text-gray-500 truncate">{result.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedStock && (
        <Card className="border-blue-100">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-3">
              {selectedStock.name} ({selectedStock.ticker})
            </h2>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-500">Price:</span>
                <span className="font-medium">${selectedStock.price.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Dividend Yield:</span>
                <span className="font-medium">{(selectedStock.dividendYield * 100).toFixed(2)}%</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Latest Dividend:</span>
                <span className="font-medium">${selectedStock.latestDividend.toFixed(4)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Ex-Dividend Date:</span>
                <span className="font-medium">{formatDate(selectedStock.exDivDate)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Payment Date:</span>
                <span className="font-medium">{formatDate(selectedStock.paymentDate)}</span>
              </p>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleUseData} size="sm">Use This Data</Button>
            </div>
          </CardContent>
        </Card>
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
