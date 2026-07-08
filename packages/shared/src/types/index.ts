import {
  CustomerOrder,
  DriverTrip,
  PendingAction,
  OrderStatus,
  OrderPriority,
  BaseOrder,
  TripStop,
} from '../validators/order';

// Re-export Zod types
export type {
  OrderStatus,
  OrderPriority,
  BaseOrder,
  CustomerOrder,
  TripStop,
  DriverTrip,
  PendingAction,
};

// Generic API response container
export interface ApiResponse<T> {
  data: T;
  requestId: string;
  status: number;
}

// Global App Error shape
export interface AppError {
  message: string;
  code: string; // E.g. 'NETWORK_ERROR', 'UNAUTHORIZED', 'NOT_FOUND', 'VALIDATION_ERROR', 'SERVER_ERROR', 'CANCELLED'
  status?: number;
  details?: unknown;
  technicalMessage?: string;
}
export type OrderViewMode = 'customer' | 'driver' | 'admin';
export interface OrderCardProps {
  order: BaseOrder & {
    eta?: string;
    actionType?: 'APPROVE_ORDER' | 'REASSIGN_DRIVER' | 'CANCEL_ORDER';
    reason?: string;
  };
  viewMode: OrderViewMode;
  onActionPress?: (action: string, orderId: string) => void;
  isLoading?: boolean;
}
export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
}
