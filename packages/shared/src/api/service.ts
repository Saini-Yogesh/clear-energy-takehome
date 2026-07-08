import { apiClient } from './client';
import { parseApiError } from './errors';
import { CustomerOrderSchema, DriverTripSchema, PendingActionSchema } from '../validators/order';
import { CustomerOrder, DriverTrip, PendingAction } from '../types';
import { z } from 'zod';

export const ApiService = {
  /**
   * Fetches orders for a specific customer
   */
  getOrders: async (customerId: string, signal?: AbortSignal): Promise<CustomerOrder[]> => {
    try {
      const response = await apiClient.get<unknown>(`/orders`, {
        params: { customerId },
        signal,
      });
      // Validate the response shape at runtime
      return z.array(CustomerOrderSchema).parse(response.data);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  /**
   * Fetches trips for a specific driver
   */
  getTrips: async (driverId: string, signal?: AbortSignal): Promise<DriverTrip[]> => {
    try {
      const response = await apiClient.get<unknown>(`/trips`, {
        params: { driverId },
        signal,
      });
      // Validate response structure
      return z.array(DriverTripSchema).parse(response.data);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  /**
   * Fetches pending queue actions for an admin
   */
  getPendingActions: async (adminId: string, signal?: AbortSignal): Promise<PendingAction[]> => {
    try {
      const response = await apiClient.get<unknown>(`/pending-actions`, {
        params: { adminId },
        signal,
      });
      // Validate response structure
      return z.array(PendingActionSchema).parse(response.data);
    } catch (error) {
      throw parseApiError(error);
    }
  },

  /**
   * Resolves a pending action (e.g. approving/cancelling order)
   * This demonstrates idempotency key generation and headers in action
   */
  resolveAction: async (
    actionId: string,
    actionType: 'APPROVE_ORDER' | 'REASSIGN_DRIVER' | 'CANCEL_ORDER',
    reason?: string,
    signal?: AbortSignal,
  ): Promise<PendingAction> => {
    try {
      const response = await apiClient.patch<unknown>(
        `/pending-actions/${actionId}`,
        { status: 'COMPLETED', actionType, reason },
        { signal },
      );
      return PendingActionSchema.parse(response.data);
    } catch (error) {
      throw parseApiError(error);
    }
  },
};
