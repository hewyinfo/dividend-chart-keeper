
import { SecuritySearchResult, StockData } from "@/types/dividend";

// In a real app, these should be in environment variables or Supabase secrets
// For demo purposes, we'll use a placeholder API key - users should replace this with their own
const API_KEY = "YOUR_INTRINIO_API_KEY";
const BASE_URL = "https://api-v2.intrinio.com";

export async function searchSecurities(query: string): Promise<SecuritySearchResult[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(
      `${BASE_URL}/securities/search?query=${encodeURIComponent(query)}`, 
      { headers: { "Authorization": `Bearer ${API_KEY}` } }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.securities.map((item: any) => ({
      ticker: item.ticker,
      name: item.name,
      securityType: item.security_type,
      exchange: item.exchange
    })).slice(0, 10); // Limit results
  } catch (error) {
    console.error("Error searching securities:", error);
    return [];
  }
}

export async function getStockData(ticker: string): Promise<StockData | null> {
  try {
    // Make parallel API requests for better performance
    const [securityResponse, dividendResponse] = await Promise.all([
      fetch(`${BASE_URL}/securities/${ticker}`, {
        headers: { "Authorization": `Bearer ${API_KEY}` }
      }),
      fetch(`${BASE_URL}/securities/${ticker}/dividends/latest`, {
        headers: { "Authorization": `Bearer ${API_KEY}` }
      })
    ]);
    
    if (!securityResponse.ok || !dividendResponse.ok) {
      throw new Error("Failed to fetch stock data");
    }
    
    const securityData = await securityResponse.json();
    const dividendData = await dividendResponse.json();
    
    return {
      ticker: securityData.ticker,
      name: securityData.name,
      price: securityData.last_price || 0,
      dividendYield: securityData.dividend_yield || 0,
      latestDividend: dividendData.amount || 0,
      exDivDate: dividendData.ex_dividend || "",
      paymentDate: dividendData.pay_date || ""
    };
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null;
  }
}
