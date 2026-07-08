import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../api/service';
import { CACHE_KEYS } from '../constants';

/**
 * React Query hook to fetch customer orders with caching and cancellation
 */
export const useOrders = (customerId: string) => {
  return useQuery({
    queryKey: [CACHE_KEYS.ORDERS, customerId],
    queryFn: ({ signal }) => ApiService.getOrders(customerId, signal),
    enabled: !!customerId,
  });
};
