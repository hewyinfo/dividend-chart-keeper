
import React from "react";
import { RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StockData } from "@/types/dividend";

interface StockDetailsCardProps {
  stock: StockData;
  onRefresh: () => void;
  onUseData: () => void;
}

const StockDetailsCard = ({ stock, onRefresh, onUseData }: StockDetailsCardProps) => {
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <Card className="border-blue-100">
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-3">
          {stock.name} ({stock.ticker})
        </h2>
        <div className="space-y-2">
          <p className="flex justify-between">
            <span className="text-gray-500">Price:</span>
            <span className="font-medium">${stock.price.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500">Dividend Yield:</span>
            <span className="font-medium">{(stock.dividendYield * 100).toFixed(2)}%</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500">Latest Dividend:</span>
            <span className="font-medium">${stock.latestDividend.toFixed(4)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500">Ex-Dividend Date:</span>
            <span className="font-medium">{formatDate(stock.exDivDate)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500">Payment Date:</span>
            <span className="font-medium">{formatDate(stock.paymentDate)}</span>
          </p>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={onUseData} size="sm">Use This Data</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockDetailsCard;
