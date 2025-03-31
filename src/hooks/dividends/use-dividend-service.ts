
import { useCallback } from 'react';
import { DividendEvent } from '@/types/dividend';
import { supabase } from '@/integrations/supabase/client';
import { 
  getMockDividendEvents, 
  addMockDividendEvent, 
  updateMockDividendEvent, 
  deleteMockDividendEvent,
  exportMockToCsv,
  addMockCashEvent 
} from '@/services/mockDataService';

export function useDividendService(setDividendEvents: React.Dispatch<React.SetStateAction<DividendEvent[]>>) {
  // Determine if we should use Supabase or mock data
  const shouldUseSupabase = useCallback((user: any) => {
    return !!user;
  }, []);

  // Fetch dividend events from either Supabase or mock service
  const fetchDividendEvents = useCallback(async (user: any) => {
    if (shouldUseSupabase(user)) {
      // Use Supabase to fetch real data
      const { data, error } = await supabase
        .from('dividends')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Convert Supabase data format to match the DividendEvent type
      return data.map(item => ({
        id: item.id,
        ticker: item.ticker,
        exDate: item.ex_div_date || '',
        payDate: item.payment_date || undefined,
        yield: item.dividend_yield,
        received: item.status === 'Confirmed',
        amount: item.amount,
        status: item.status as 'Confirmed' | 'Projected',
        notes: item.notes,
        yieldOnCost: item.yoc,
        price: item.amount,
        created_at: item.created_at,
      }));
    } else {
      // Use the mock service if not authenticated or for testing
      return await getMockDividendEvents();
    }
  }, [shouldUseSupabase]);

  // Add a new dividend event
  const addDividendEvent = useCallback(async (event: DividendEvent, user: any) => {
    if (shouldUseSupabase(user)) {
      // Use Supabase to insert real data
      const { data, error } = await supabase
        .from('dividends')
        .insert({
          ticker: event.ticker,
          ex_div_date: event.exDate,
          payment_date: event.payDate,
          dividend_yield: event.yield,
          amount: event.amount,
          status: event.status,
          notes: event.notes,
          yoc: event.yieldOnCost,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        ticker: data.ticker,
        exDate: data.ex_div_date,
        payDate: data.payment_date,
        yield: data.dividend_yield,
        received: data.status === 'Confirmed',
        amount: data.amount,
        status: data.status as 'Confirmed' | 'Projected',
        notes: data.notes,
        yieldOnCost: data.yoc,
        price: data.amount,
        created_at: data.created_at,
      };
    } else {
      // Use the mock service
      return await addMockDividendEvent(event);
    }
  }, [shouldUseSupabase]);

  // Add a cash event
  const addCashEvent = useCallback(async (amount: number, date: Date, notes: string, user: any) => {
    if (shouldUseSupabase(user)) {
      // Use Supabase to insert real cash data
      const { data, error } = await supabase
        .from('dividends')
        .insert({
          ticker: "CASH",
          ex_div_date: date.toISOString().split('T')[0],
          amount: amount,
          status: "Confirmed",
          notes: notes,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        ticker: data.ticker,
        exDate: data.ex_div_date,
        received: true,
        amount: data.amount,
        status: data.status as 'Confirmed' | 'Projected',
        notes: data.notes,
        price: data.amount,
        created_at: data.created_at,
      };
    } else {
      // Use the mock service
      return await addMockCashEvent(amount, date, notes);
    }
  }, [shouldUseSupabase]);

  // Update an existing dividend event
  const updateDividendEvent = useCallback(async (event: DividendEvent, user: any) => {
    if (shouldUseSupabase(user)) {
      // Use Supabase to update real data
      const { data, error } = await supabase
        .from('dividends')
        .update({
          ticker: event.ticker,
          ex_div_date: event.exDate,
          payment_date: event.payDate,
          dividend_yield: event.yield,
          amount: event.amount,
          status: event.status,
          notes: event.notes,
          yoc: event.yieldOnCost,
        })
        .eq('id', event.id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        ticker: data.ticker,
        exDate: data.ex_div_date,
        payDate: data.payment_date,
        yield: data.dividend_yield,
        received: data.status === 'Confirmed',
        amount: data.amount,
        status: data.status as 'Confirmed' | 'Projected',
        notes: data.notes,
        yieldOnCost: data.yoc,
        price: data.amount,
        created_at: data.created_at,
      };
    } else {
      // Use the mock service
      return await updateMockDividendEvent(event);
    }
  }, [shouldUseSupabase]);

  // Delete a dividend event
  const deleteDividendEvent = useCallback(async (id: string, user: any) => {
    if (shouldUseSupabase(user)) {
      // Use Supabase to delete real data
      const { error } = await supabase
        .from('dividends')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      return true;
    } else {
      // Use the mock service
      return await deleteMockDividendEvent(id);
    }
  }, [shouldUseSupabase]);

  // Export data to CSV
  const exportToCSV = useCallback(async (dividendEvents: DividendEvent[], user: any) => {
    if (shouldUseSupabase(user)) {
      // For Supabase, we'll construct the CSV from the current data
      if (dividendEvents.length === 0) return '';
      
      // Create CSV header row
      const headers = Object.keys(dividendEvents[0]).join(',');
      
      // Create CSV data rows
      const rows = dividendEvents.map(item => 
        Object.values(item)
          .map(value => typeof value === 'string' ? `"${value}"` : value)
          .join(',')
      );
      
      // Combine header and rows
      return [headers, ...rows].join('\n');
    } else {
      // Use the mock service
      return await exportMockToCsv();
    }
  }, [shouldUseSupabase]);

  return {
    fetchDividendEvents,
    addDividendEvent,
    updateDividendEvent,
    deleteDividendEvent,
    addCashEvent,
    exportToCSV
  };
}
