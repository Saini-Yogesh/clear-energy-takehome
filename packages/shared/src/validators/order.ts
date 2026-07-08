import { z } from 'zod';

export const OrderStatusSchema = z.enum([
  'PENDING',
  'ASSIGNED',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELLED',
  'REJECTED',
]);

export const OrderPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const BaseOrderSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  address: z.string(),
  amount: z.number().int().nonnegative(), // Amount in paise
  sku: z.string(),
  status: OrderStatusSchema,
  priority: OrderPrioritySchema,
  createdAt: z.string(), // ISO String
});

// Customer Order
export const CustomerOrderSchema = BaseOrderSchema.extend({
  customerId: z.string(),
});

// Stop in a Driver's Trip
export const TripStopSchema = BaseOrderSchema.extend({
  eta: z.string(), // ISO String or formatted time
  sequence: z.number().int().positive(),
});

// Driver Trip
export const DriverTripSchema = z.object({
  id: z.string(),
  driverId: z.string(),
  status: z.enum(['SCHEDULED', 'ACTIVE', 'COMPLETED']),
  stops: z.array(TripStopSchema),
});

// Admin Pending Action
export const PendingActionSchema = BaseOrderSchema.extend({
  adminId: z.string(),
  actionType: z.enum(['APPROVE_ORDER', 'REASSIGN_DRIVER', 'CANCEL_ORDER']),
  reason: z.string().optional(),
});
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type OrderPriority = z.infer<typeof OrderPrioritySchema>;
export type BaseOrder = z.infer<typeof BaseOrderSchema>;
export type CustomerOrder = z.infer<typeof CustomerOrderSchema>;
export type TripStop = z.infer<typeof TripStopSchema>;
export type DriverTrip = z.infer<typeof DriverTripSchema>;
export type PendingAction = z.infer<typeof PendingActionSchema>;
