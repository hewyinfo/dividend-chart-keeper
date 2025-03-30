
export interface DividendEvent {
  ticker: string;
  exDate: string;
  payDate?: string;
  yield?: number;
  received: boolean;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}
