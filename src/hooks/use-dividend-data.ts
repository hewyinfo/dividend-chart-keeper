
import { useState, useEffect, useCallback } from 'react';
import { DividendEvent, DividendFilters } from '@/types/dividend';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  getMockDividendEvents, 
  addMockDividendEvent, 
  updateMockDividendEvent, 
  deleteMockDividendEvent,
  exportMockToCsv,
  addMockCashEvent 
} from '@/services/mockDataService';

export function useDividendData() {
  const [dividendEvents, setDividendEvents] = useState<DividendEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DividendFilters>({
    showCashUtilized: true,
    showDividendsPaid: true,
    showProjectedDividends: true,
    timeScale: 'monthly',
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const [useSupabase, setUseSupabase] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated and we should use Supabase
    if (user) {
      setUseSupabase(true);
    }
  }, [user]);

  const loadDividendEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (useSupabase && user) {
        // Use Supabase to fetch real data
        const { data, error } = await supabase
          .from('dividends')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Convert Supabase data format to match the DividendEvent type
        const formattedData: DividendEvent[] = data.map(item => ({
          id: item.id,
          ticker: item.ticker,
          exDate: item.ex_div_date || '',
          payDate: item.payment_date || undefined,
          yield: item.dividend_yield,
          received: item.status === 'Confirmed',
          amount: item.amount,
          status: item.status === 'Confirmed' ? 'Confirmed' : 'Projected',
          notes: item.notes,
          yieldOnCost: item.yoc,
          price: item.price,
          created_at: item.created_at,
        }));
        
        setDividendEvents(formattedData);
      } else {
        // Use the mock service if not authenticated or for testing
        const events = await getMockDividendEvents();
        setDividendEvents(events);
      }
    } catch (err) {
      console.error('Failed to load dividend events:', err);
      setError('Failed to load dividend events. Please try again later.');
      toast({
        title: 'Error',
        description: 'Failed to load dividend events. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user, useSupabase]);

  const addEvent = useCallback(async (event: DividendEvent) => {
    try {
      if (useSupabase && user) {
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
            price: event.price,
            user_id: user.id
          })
          .select()
          .single();
          
        if (error) throw error;
        
        const newEvent: DividendEvent = {
          id: data.id,
          ticker: data.ticker,
          exDate: data.ex_div_date,
          payDate: data.payment_date,
          yield: data.dividend_yield,
          received: data.status === 'Confirmed',
          amount: data.amount,
          status: data.status,
          notes: data.notes,
          yieldOnCost: data.yoc,
          price: data.price,
          created_at: data.created_at,
        };
        
        setDividendEvents(prev => [...prev, newEvent]);
        toast({
          title: 'Success',
          description: `Added ${event.ticker} dividend event`,
        });
        return newEvent;
      } else {
        // Use the mock service
        const newEvent = await addMockDividendEvent(event);
        
        if (newEvent) {
          setDividendEvents(prev => [...prev, newEvent]);
          toast({
            title: 'Success',
            description: `Added ${event.ticker} dividend event`,
          });
          return newEvent;
        }
        
        throw new Error('Failed to add event');
      }
    } catch (err) {
      console.error('Failed to add dividend event:', err);
      toast({
        title: 'Error',
        description: 'Failed to add dividend event. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast, user, useSupabase]);

  const addCashEvent = useCallback(async (amount: number, date: Date, notes: string) => {
    try {
      if (useSupabase && user) {
        // Use Supabase to insert real cash data
        const { data, error } = await supabase
          .from('dividends')
          .insert({
            ticker: "CASH",
            ex_div_date: date.toISOString().split('T')[0],
            amount: amount,
            status: "Confirmed",
            notes: notes,
            price: amount,
            user_id: user.id
          })
          .select()
          .single();
          
        if (error) throw error;
        
        const newEvent: DividendEvent = {
          id: data.id,
          ticker: data.ticker,
          exDate: data.ex_div_date,
          received: true,
          amount: data.amount,
          status: "Confirmed",
          notes: data.notes,
          price: data.price,
          created_at: data.created_at,
        };
        
        setDividendEvents(prev => [...prev, newEvent]);
        
        return newEvent;
      } else {
        // Use the mock service
        const newEvent = await addMockCashEvent(amount, date, notes);
        
        if (newEvent) {
          setDividendEvents(prev => [...prev, newEvent]);
          return newEvent;
        }
        
        throw new Error('Failed to add cash event');
      }
    } catch (err) {
      console.error('Failed to add cash event:', err);
      toast({
        title: 'Error',
        description: 'Failed to add cash event. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast, user, useSupabase]);

  const updateEvent = useCallback(async (event: DividendEvent) => {
    if (!event.id) {
      toast({
        title: 'Error',
        description: 'Cannot update event without an ID',
        variant: 'destructive',
      });
      return null;
    }
    
    try {
      if (useSupabase && user) {
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
            price: event.price,
          })
          .eq('id', event.id)
          .eq('user_id', user.id)
          .select()
          .single();
          
        if (error) throw error;
        
        const updatedEvent: DividendEvent = {
          id: data.id,
          ticker: data.ticker,
          exDate: data.ex_div_date,
          payDate: data.payment_date,
          yield: data.dividend_yield,
          received: data.status === 'Confirmed',
          amount: data.amount,
          status: data.status,
          notes: data.notes,
          yieldOnCost: data.yoc,
          price: data.price,
          created_at: data.created_at,
        };
        
        setDividendEvents(prev => 
          prev.map(e => e.id === updatedEvent.id ? updatedEvent : e)
        );
        toast({
          title: 'Success',
          description: `Updated ${event.ticker} dividend event`,
        });
        return updatedEvent;
      } else {
        // Use the mock service
        const updatedEvent = await updateMockDividendEvent(event);
        
        if (updatedEvent) {
          setDividendEvents(prev => 
            prev.map(e => e.id === updatedEvent.id ? updatedEvent : e)
          );
          toast({
            title: 'Success',
            description: `Updated ${event.ticker} dividend event`,
          });
          return updatedEvent;
        }
        
        throw new Error('Failed to update event');
      }
    } catch (err) {
      console.error('Failed to update dividend event:', err);
      toast({
        title: 'Error',
        description: 'Failed to update dividend event. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast, user, useSupabase]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      if (useSupabase && user) {
        // Use Supabase to delete real data
        const { error } = await supabase
          .from('dividends')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setDividendEvents(prev => prev.filter(e => e.id !== id));
        toast({
          title: 'Success',
          description: 'Dividend event deleted',
        });
        return true;
      } else {
        // Use the mock service
        const success = await deleteMockDividendEvent(id);
        
        if (success) {
          setDividendEvents(prev => prev.filter(e => e.id !== id));
          toast({
            title: 'Success',
            description: 'Dividend event deleted',
          });
          return true;
        }
        
        throw new Error('Failed to delete event');
      }
    } catch (err) {
      console.error('Failed to delete dividend event:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete dividend event. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, user, useSupabase]);

  const updateFilters = useCallback((newFilters: Partial<DividendFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const exportData = useCallback(async () => {
    try {
      if (useSupabase && user) {
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
        const csvData = await exportMockToCsv();
        return csvData;
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  }, [dividendEvents, user, useSupabase]);

  // Load dividend events on component mount or when user changes
  useEffect(() => {
    if (!isLoading) {
      loadDividendEvents();
    }
  }, [loadDividendEvents, user]);

  // Load initial data
  useEffect(() => {
    loadDividendEvents();
  }, [loadDividendEvents]);

  return {
    dividendEvents,
    isLoading,
    error,
    filters,
    addEvent,
    updateEvent,
    deleteEvent,
    reloadEvents: loadDividendEvents,
    updateFilters,
    exportData,
    addCashEvent,
  };
}
