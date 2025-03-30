
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

// Use environment variables to determine if we should use Supabase
const USE_SUPABASE = false; // Change this when Supabase is set up

// Conditionally import Supabase functions
let supabaseService: any = null;
if (USE_SUPABASE) {
  // This will be loaded dynamically when Supabase is set up
  import('@/services/supabaseService').then(module => {
    supabaseService = module;
  });
}

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
      let events: DividendEvent[];
      
      if (USE_SUPABASE && supabaseService) {
        events = await supabaseService.fetchDividendEvents();
      } else {
        // Use mock data during development
        events = await getMockDividendEvents();
      }
      
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
      let newEvent: DividendEvent | null;
      
      if (USE_SUPABASE && supabaseService) {
        newEvent = await supabaseService.addDividendEvent(event);
      } else {
        // Use mock data during development
        newEvent = await addMockDividendEvent(event);
      }
      
      if (newEvent) {
        setDividendEvents(prev => [...prev, newEvent!]);
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
      let updatedEvent: DividendEvent | null;
      
      if (USE_SUPABASE && supabaseService) {
        updatedEvent = await supabaseService.updateDividendEvent(event);
      } else {
        // Use mock data during development
        updatedEvent = await updateMockDividendEvent(event);
      }
      
      if (updatedEvent) {
        setDividendEvents(prev => 
          prev.map(e => e.id === updatedEvent!.id ? updatedEvent! : e)
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
      let success: boolean;
      
      if (USE_SUPABASE && supabaseService) {
        success = await supabaseService.deleteDividendEvent(id);
      } else {
        // Use mock data during development
        success = await deleteMockDividendEvent(id);
      }
      
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

  // Export function that uses the correct service
  const exportData = useCallback(async () => {
    if (USE_SUPABASE && supabaseService) {
      return await supabaseService.exportToCsv();
    } else {
      return await exportMockToCsv();
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
