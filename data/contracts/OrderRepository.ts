export interface OrderRepository {
  getOrders(): Promise<any[]>;
  saveOrders(orders: any[]): Promise<void>;
  updateOrderStatus(orderId: string, status: string): Promise<void>;
  createOrder(order: any): Promise<any>;
  getCustomerContext(): Promise<{ name: string; phone: string; table: string }>;
  saveCustomerContext(context: { name: string; phone: string; table: string }): Promise<void>;
  subscribeOrders(callback: (orders: any[]) => void): () => void;
}
