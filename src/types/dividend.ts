
export interface DividendEvent {
  id?: string;
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
  created_at?: string;
  safetyScore?: number;
  safetyRating?: 'Low' | 'Medium' | 'High';
}

export interface ChartDataPoint {
  date: string;
  value: number;
  cashUtilized?: number;
  cumulativePaid?: number;
  cumulativeProjected?: number;
  events?: DividendEvent[];
}

export interface SecuritySearchResult {
  ticker: string;
  name: string;
  securityType?: string;
  exchange?: string;
}

export interface DividendSafetyScore {
  score: number;
  payoutRatio: number | null;
  rating: 'Low' | 'Medium' | 'High';
}

export interface StockData {
  ticker: string;
  name: string;
  price: number;
  dividendYield: number;
  latestDividend: number;
  exDivDate: string;
  paymentDate: string;
  safetyScore?: DividendSafetyScore;
}

export interface DividendFilters {
  showCashUtilized: boolean;
  showDividendsPaid: boolean;
  showProjectedDividends: boolean;
  ticker?: string;
  timeScale: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  minSafetyScore?: number;
}
