import { randomUUID } from "node:crypto";

export const products = {
  notebook: { name: "Payment practice", amount: 15000 },
  coffee: { name: "Mo:Mo & coffee for Sujjal", amount: 50000 },
} as const;

export type ProductId = keyof typeof products;
type PendingOrder = { productId: ProductId; pidx?: string; createdAt: number };

// Intentionally in-memory for this learning project. Use a persistent database
// and atomic updates for real orders; this store resets when the server restarts.
const globalForOrders = globalThis as typeof globalThis & { khaltiOrders?: Map<string, PendingOrder> };
const orders = globalForOrders.khaltiOrders ?? new Map<string, PendingOrder>();
globalForOrders.khaltiOrders = orders;

export function createOrder(productId: ProductId) {
  const orderId = `practice-${randomUUID()}`;
  orders.set(orderId, { productId, createdAt: Date.now() });
  return orderId;
}

export function attachPidx(orderId: string, pidx: string) {
  const order = orders.get(orderId);
  if (!order) return false;
  order.pidx = pidx;
  return true;
}

export function getOrder(orderId: string) {
  const order = orders.get(orderId);
  if (!order || Date.now() - order.createdAt > 60 * 60 * 1000) {
    orders.delete(orderId);
    return undefined;
  }
  return order;
}
