import { useState, useCallback } from 'react';
import { Logger } from '../utils/logger';

/**
 * Hook to manage flatlist pull-to-refresh states and handle execution safely
 */
export const useRefresh = (onRefresh: () => Promise<unknown>) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (e) {
      Logger.error('[PullToRefresh Error]', e);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  return { isRefreshing, handleRefresh };
};
