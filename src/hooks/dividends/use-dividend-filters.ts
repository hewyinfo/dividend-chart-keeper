
import { useState, useCallback } from 'react';
import { DividendFilters } from '@/types/dividend';

export function useDividendFilters() {
  const [filters, setFilters] = useState<DividendFilters>({
    showCashUtilized: true,
    showDividendsPaid: true,
    showProjectedDividends: true,
    timeScale: 'monthly',
  });

  const updateFilters = useCallback((newFilters: Partial<DividendFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return { filters, updateFilters };
}
