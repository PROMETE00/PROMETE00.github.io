import { useState, useEffect } from 'react';
import { ScheduleWeek } from '../types/types-schedules';
import { fetchScheduleData } from '../lib/google-sheets-schedules';

interface UseScheduleDataOptions {
  refreshInterval?: number; // en milisegundos
  autoRefresh?: boolean;
}

export function useScheduleData(options: UseScheduleDataOptions = {}) {
  const { refreshInterval = 30000, autoRefresh = true } = options;
  
  // Estado para los datos del horario
  const [weeks, setWeeks] = useState<ScheduleWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el auto-refresh
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Efecto para el auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const timer = setInterval(() => {
      setRefreshCount(prev => prev + 1);
      setLastRefresh(new Date());
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [refreshInterval, autoRefresh]);

  // Efecto para cargar los datos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchScheduleData();
        setWeeks(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los horarios');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshCount]); // Se ejecuta cuando cambia refreshCount

  // Función para refrescar manualmente
  const triggerRefresh = () => {
    setRefreshCount(prev => prev + 1);
    setLastRefresh(new Date());
  };

  return { 
    weeks, 
    loading, 
    error,
    lastRefresh,
    triggerRefresh,
    refreshCount
  };
}