
import { useState, useEffect, useCallback } from 'react';
import { DividendEvent, DividendFilters } from '@/types/dividend';
import { useToast } from '@/hooks/use-toast';
import { 
  getMockDividendEvents, 
  addMockDividendEvent, 
  updateMockDividendEvent, 
  deleteMockDividendEvent,
  exportMockToCsv
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

  const loadDividendEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the mock service instead of Supabase for now
      const events = await getMockDividendEvents();
      setDividendEvents(events);
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
  }, [toast]);

  const addEvent = useCallback(async (event: DividendEvent) => {
    try {
      // Use the mock service instead of Supabase for now
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
    } catch (err) {
      console.error('Failed to add dividend event:', err);
      toast({
        title: 'Error',
        description: 'Failed to add dividend event. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

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
      // Use the mock service instead of Supabase for now
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
    } catch (err) {
      console.error('Failed to update dividend event:', err);
      toast({
        title: 'Error',
        description: 'Failed to update dividend event. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      // Use the mock service instead of Supabase for now
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
    } catch (err) {
      console.error('Failed to delete dividend event:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete dividend event. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const updateFilters = useCallback((newFilters: Partial<DividendFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const exportData = useCallback(async () => {
    try {
      // Use the mock service instead of Supabase for now
      const csvData = await exportMockToCsv();
      return csvData;
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  }, []);

  // Load dividend events on component mount
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
  };
}
