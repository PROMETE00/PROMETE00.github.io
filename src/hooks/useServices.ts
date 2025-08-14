import useSWR from 'swr';
import { fetchGoogleSheetData } from '@/lib/google-sheets';
import { Service } from '@/types';

export function useServices() {
  const { data, error, isLoading, mutate, isValidating } = useSWR<Service[]>(
    'services-data',
    () => fetchGoogleSheetData(), // Configuración adicional puede ir aquí
    {
      refreshInterval: 15000, // 15 segundos
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      dedupingInterval: 10000
    }
  );

  return {
    services: data || [],
    isLoading,
    error,
    refresh: mutate,
    isValidating,
    isEmpty: !isLoading && !error && data?.length === 0
  };
}