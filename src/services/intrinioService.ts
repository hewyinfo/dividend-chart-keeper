
import { SecuritySearchResult, StockData, DividendSafetyScore } from "@/types/dividend";

// In a real app, these should be in environment variables or Supabase secrets
// For demo purposes, we'll use a placeholder API key - users should replace this with their own
const API_KEY = "YOUR_INTRINIO_API_KEY";
const BASE_URL = "https://api-v2.intrinio.com";

// Get the API key from localStorage if available
const getApiKey = (): string => {
  const storedKey = localStorage.getItem('intrinio_api_key');
  return storedKey || API_KEY;
};

// Save API key to localStorage
export const saveApiKey = (key: string): void => {
  localStorage.setItem('intrinio_api_key', key);
};

export async function searchSecurities(query: string): Promise<SecuritySearchResult[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(
      `${BASE_URL}/securities/search?query=${encodeURIComponent(query)}`, 
      { headers: { "Authorization": `Bearer ${getApiKey()}` } }
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
    const [securityResponse, dividendResponse, safetyResponse] = await Promise.all([
      fetch(`${BASE_URL}/securities/${ticker}`, {
        headers: { "Authorization": `Bearer ${getApiKey()}` }
      }),
      fetch(`${BASE_URL}/securities/${ticker}/dividends/latest`, {
        headers: { "Authorization": `Bearer ${getApiKey()}` }
      }),
      fetch(`${BASE_URL}/securities/${ticker}/metrics`, {
        headers: { "Authorization": `Bearer ${getApiKey()}` }
      })
    ]);
    
    if (!securityResponse.ok || !dividendResponse.ok) {
      throw new Error("Failed to fetch stock data");
    }
    
    const securityData = await securityResponse.json();
    const dividendData = await dividendResponse.json();
    let safetyData = { payout_ratio: null };
    
    if (safetyResponse.ok) {
      safetyData = await safetyResponse.json();
    }
    
    // Calculate a simplified dividend safety score
    let safetyScore = 0;
    
    // Based on payout ratio (lower is better)
    if (safetyData.payout_ratio !== null) {
      if (safetyData.payout_ratio < 0.3) safetyScore += 40;
      else if (safetyData.payout_ratio < 0.5) safetyScore += 30;
      else if (safetyData.payout_ratio < 0.7) safetyScore += 20;
      else if (safetyData.payout_ratio < 0.9) safetyScore += 10;
    }
    
    // Based on dividend yield (moderate is better)
    const dividendYield = securityData.dividend_yield || 0;
    if (dividendYield > 0 && dividendYield < 0.02) safetyScore += 15;
    else if (dividendYield >= 0.02 && dividendYield < 0.05) safetyScore += 25;
    else if (dividendYield >= 0.05 && dividendYield < 0.08) safetyScore += 15;
    else if (dividendYield >= 0.08) safetyScore += 5;
    
    // Based on dividend consistency (if we have data)
    if (securityData.has_dividends) safetyScore += 35;
    
    return {
      ticker: securityData.ticker,
      name: securityData.name,
      price: securityData.last_price || 0,
      dividendYield: securityData.dividend_yield || 0,
      latestDividend: dividendData.amount || 0,
      exDivDate: dividendData.ex_dividend || "",
      paymentDate: dividendData.pay_date || "",
      safetyScore: {
        score: safetyScore,
        payoutRatio: safetyData.payout_ratio,
        rating: getDividendSafetyRating(safetyScore)
      }
    };
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null;
  }
}

function getDividendSafetyRating(score: number): 'Low' | 'Medium' | 'High' {
  if (score >= 75) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
}

export async function getHistoricalDividends(ticker: string): Promise<any[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/securities/${ticker}/dividends?page_size=10`, 
      { headers: { "Authorization": `Bearer ${getApiKey()}` } }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.dividends || [];
  } catch (error) {
    console.error("Error fetching historical dividends:", error);
    return [];
  }
}
