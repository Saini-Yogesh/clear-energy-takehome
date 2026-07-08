import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '../api/service';
import { CACHE_KEYS } from '../constants';

/**
 * React Query hook to manage admin pending actions queue and resolutions
 */
export const usePendingActions = (adminId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [CACHE_KEYS.PENDING_ACTIONS, adminId],
    queryFn: ({ signal }) => ApiService.getPendingActions(adminId, signal),
    enabled: !!adminId,
  });

  const mutation = useMutation({
    mutationFn: ({
      actionId,
      actionType,
      reason,
    }: {
      actionId: string;
      actionType: 'APPROVE_ORDER' | 'REASSIGN_DRIVER' | 'CANCEL_ORDER';
      reason?: string;
    }) => ApiService.resolveAction(actionId, actionType, reason),
    onSuccess: () => {
      // Invalidate cache to trigger automatic refetch
      queryClient.invalidateQueries({ queryKey: [CACHE_KEYS.PENDING_ACTIONS, adminId] });
    },
  });

  return {
    ...query,
    resolveAction: mutation.mutateAsync,
    isResolving: mutation.isPending,
  };
};
