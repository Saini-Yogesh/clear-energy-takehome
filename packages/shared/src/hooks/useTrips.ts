import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../api/service';
import { CACHE_KEYS } from '../constants';

/**
 * React Query hook to fetch driver trips and stops
 */
export const useTrips = (driverId: string) => {
  return useQuery({
    queryKey: [CACHE_KEYS.TRIPS, driverId],
    queryFn: ({ signal }) => ApiService.getTrips(driverId, signal),
    enabled: !!driverId,
  });
};
