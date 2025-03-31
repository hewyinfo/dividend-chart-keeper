
import { useState, useEffect, useCallback } from 'react';
import { DividendEvent, DividendFilters } from '@/types/dividend';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useDividendService } from './use-dividend-service';
import { useDividendFilters } from './use-dividend-filters';

export function useDividendEvents() {
  const [dividendEvents, setDividendEvents] = useState<DividendEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { filters, updateFilters } = useDividendFilters();
  const { 
    fetchDividendEvents, 
    addDividendEvent, 
    updateDividendEvent, 
    deleteDividendEvent,
    addCashEvent,
    exportToCSV
  } = useDividendService(setDividendEvents);

  const loadDividendEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const events = await fetchDividendEvents(user);
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
  }, [toast, user, fetchDividendEvents]);

  const addEvent = useCallback(async (event: DividendEvent) => {
    try {
      const newEvent = await addDividendEvent(event, user);
      
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
  }, [toast, user, addDividendEvent]);

  const addCashEventHandler = useCallback(async (amount: number, date: Date, notes: string) => {
    try {
      const newEvent = await addCashEvent(amount, date, notes, user);
      
      if (newEvent) {
        setDividendEvents(prev => [...prev, newEvent]);
        return newEvent;
      }
      
      throw new Error('Failed to add cash event');
    } catch (err) {
      console.error('Failed to add cash event:', err);
      toast({
        title: 'Error',
        description: 'Failed to add cash event. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast, user, addCashEvent]);

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
      const updatedEvent = await updateDividendEvent(event, user);
      
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
  }, [toast, user, updateDividendEvent]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      const success = await deleteDividendEvent(id, user);
      
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
  }, [toast, user, deleteDividendEvent]);

  const exportData = useCallback(async () => {
    try {
      return await exportToCSV(dividendEvents, user);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  }, [dividendEvents, user, exportToCSV]);

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
    addCashEvent: addCashEventHandler,
  };
}
