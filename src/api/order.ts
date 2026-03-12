import type { OrderFilter, OrderItem, PageResult } from '@/types';
import request from '@/utils/request';

export function fetchOrders(params: OrderFilter) {
  return request.get<never, PageResult<OrderItem>>('/orders', { params });
}

export const getOrderList = fetchOrders;

export function fetchOrderDetail(orderId: string) {
  return request.get<never, OrderItem>(`/orders/${orderId}`);
}
