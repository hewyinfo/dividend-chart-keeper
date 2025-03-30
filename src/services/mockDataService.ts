
import { DividendEvent } from "@/types/dividend";
import { addMonths, format, subMonths } from "date-fns";

const tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "BRK.B", "JNJ", "JPM", "PG", "XOM", "INTC"];

function generateRandomDividendEvents(count: number): DividendEvent[] {
  const events: DividendEvent[] = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const randomTickerIndex = Math.floor(Math.random() * tickers.length);
    const ticker = tickers[randomTickerIndex];
    
    // Generate dates within a reasonable range
    const exDate = format(
      subMonths(today, Math.floor(Math.random() * 6)),
      "yyyy-MM-dd"
    );
    
    const payDate = format(
      addMonths(new Date(exDate), 1),
      "yyyy-MM-dd"
    );
    
    // Generate random financial values
    const price = 50 + Math.random() * 150;
    const amount = (price * (0.01 + Math.random() * 0.03)) / 4; // Quarterly dividend
    const yield_value = (amount * 4 / price) * 100; // Annual dividend yield
    const received = Math.random() > 0.5;
    
    events.push({
      id: `id-${i}`,
      ticker,
      exDate,
      payDate,
      yield: parseFloat(yield_value.toFixed(2)),
      received,
      amount: parseFloat(amount.toFixed(4)),
      status: Math.random() > 0.3 ? "Confirmed" : "Projected",
      price: parseFloat(price.toFixed(2)),
      yieldOnCost: parseFloat(yield_value.toFixed(2)),
      notes: Math.random() > 0.7 ? `Sample note for ${ticker}` : undefined,
      created_at: new Date().toISOString(),
    });
  }
  
  // Add a couple of cash events
  events.push({
    id: `cash-1`,
    ticker: "CASH",
    exDate: format(subMonths(today, 2), "yyyy-MM-dd"),
    received: true,
    amount: 1000,
    status: "Confirmed",
    price: 1000,
    notes: "Initial Roth Contribution",
    created_at: new Date().toISOString(),
  });
  
  events.push({
    id: `cash-2`,
    ticker: "CASH",
    exDate: format(subMonths(today, 1), "yyyy-MM-dd"),
    received: true,
    amount: 500,
    status: "Confirmed",
    price: 500,
    notes: "Reinvested dividends",
    created_at: new Date().toISOString(),
  });
  
  return events;
}

export async function getMockDividendEvents(): Promise<DividendEvent[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateRandomDividendEvents(15);
}

export async function addMockDividendEvent(event: DividendEvent): Promise<DividendEvent> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    ...event,
    id: `id-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
}

export async function addMockCashEvent(amount: number, date: Date, notes: string): Promise<DividendEvent> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: `cash-${Date.now()}`,
    ticker: "CASH",
    exDate: format(date, "yyyy-MM-dd"),
    received: true,
    amount: amount,
    status: "Confirmed",
    price: amount,
    notes: notes,
    created_at: new Date().toISOString(),
  };
}

export async function updateMockDividendEvent(event: DividendEvent): Promise<DividendEvent> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    ...event,
  };
}

export async function deleteMockDividendEvent(id: string): Promise<boolean> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return true;
}

export async function exportMockToCsv(): Promise<string> {
  const events = await getMockDividendEvents();
  
  if (events.length === 0) {
    return '';
  }
  
  // Create CSV header row
  const headers = Object.keys(events[0]).join(',');
  
  // Create CSV data rows
  const rows = events.map(item => 
    Object.values(item)
      .map(value => typeof value === 'string' ? `"${value}"` : value)
      .join(',')
  );
  
  // Combine header and rows
  return [headers, ...rows].join('\n');
}
