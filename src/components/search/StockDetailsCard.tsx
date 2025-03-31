
import React from "react";
import { StockData } from "@/types/dividend";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, DollarSign, TrendingUp, Shield, RefreshCw } from "lucide-react";
import { formatDate, formatCurrency, formatPercent } from "@/lib/formatters";

interface StockDetailsCardProps {
  stock: StockData;
  onRefresh?: () => void;
  onUseData?: () => void;
}

const StockDetailsCard: React.FC<StockDetailsCardProps> = ({ stock, onRefresh, onUseData }) => {
  const getSafetyScoreColor = () => {
    if (!stock.safetyScore) return "bg-gray-200 text-gray-800";
    
    const { rating } = stock.safetyScore;
    if (rating === "High") return "bg-green-100 text-green-800";
    if (rating === "Medium") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{stock.ticker}</h3>
              <p className="text-sm text-muted-foreground">{stock.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                {formatCurrency(stock.price)}
              </Badge>
              
              {stock.safetyScore && (
                <Badge variant="outline" className={getSafetyScoreColor()}>
                  <Shield className="mr-1 h-3 w-3" />
                  {stock.safetyScore.rating} ({stock.safetyScore.score})
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Dividend Yield</span>
              <span className="text-sm">{formatPercent(stock.dividendYield)}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Last Dividend</span>
              <span className="text-sm">{formatCurrency(stock.latestDividend)}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Ex-Div Date</span>
              <span className="text-sm flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {stock.exDivDate ? formatDate(new Date(stock.exDivDate)) : "N/A"}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Payment Date</span>
              <span className="text-sm flex items-center">
                <DollarSign className="mr-1 h-3 w-3" />
                {stock.paymentDate ? formatDate(new Date(stock.paymentDate)) : "N/A"}
              </span>
            </div>
            
            {stock.safetyScore && stock.safetyScore.payoutRatio !== null && (
              <div className="flex flex-col col-span-2">
                <span className="text-sm font-medium text-muted-foreground">Payout Ratio</span>
                <span className="text-sm">{formatPercent(stock.safetyScore.payoutRatio)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {(onRefresh || onUseData) && (
        <CardFooter className="flex justify-end gap-2 pt-4">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="mr-1 h-3 w-3" />
              Refresh
            </Button>
          )}
          {onUseData && (
            <Button size="sm" onClick={onUseData}>
              Use Data
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default StockDetailsCard;
