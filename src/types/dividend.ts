
export interface DividendEvent {
  ticker: string;
  exDate: string;
  payDate?: string;
  yield?: number;
  received: boolean;
  amount?: number;
  status?: 'Confirmed' | 'Projected';
  notes?: string;
  yieldOnCost?: number;
  price?: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface StockData {
  ticker: string;
  name: string;
  price: number;
  dividendYield: number;
  latestDividend: number;
  exDivDate: string;
  paymentDate: string;
}

export interface SecuritySearchResult {
  ticker: string;
  name: string;
  securityType?: string;
  exchange?: string;
}
