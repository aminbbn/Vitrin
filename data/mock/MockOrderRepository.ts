import { OrderRepository } from '../contracts/OrderRepository';
import { storageAdapter } from '../storage/StorageAdapter';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export class MockOrderRepository implements OrderRepository {
  async getOrders(): Promise<any[]> {
    await delay();
    return storageAdapter.load().orders.orders;
  }

  async saveOrders(orders: any[]): Promise<void> {
    await delay();
    const data = storageAdapter.load();
    data.orders.orders = orders;
    storageAdapter.save(data);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    await delay(100);
    const data = storageAdapter.load();
    const orders = data.orders.orders;
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      data.orders.orders = orders;
      storageAdapter.save(data);
    }
  }

  async createOrder(order: any): Promise<any> {
    await delay(200);
    const data = storageAdapter.load();
    const existingOrders = data.orders.orders;
    
    // Add new order to top
    const updatedOrders = [order, ...existingOrders];
    data.orders.orders = updatedOrders;
    
    storageAdapter.save(data);
    return order;
  }

  async getCustomerContext(): Promise<{ name: string; phone: string; table: string }> {
    await delay();
    const data = storageAdapter.load();
    return {
      name: data.orders.customerName,
      phone: data.orders.customerPhone,
      table: data.orders.customerTable,
    };
  }

  async saveCustomerContext(context: { name: string; phone: string; table: string }): Promise<void> {
    await delay();
    const data = storageAdapter.load();
    data.orders.customerName = context.name;
    data.orders.customerPhone = context.phone;
    data.orders.customerTable = context.table;
    storageAdapter.save(data);
  }

  subscribeOrders(callback: (orders: any[]) => void): () => void {
    // Initial sync
    const currentOrders = storageAdapter.load().orders.orders;
    callback(currentOrders);
    
    // Subscribe to changes (including cross-tab storage events)
    return storageAdapter.subscribe((schema) => {
      callback(schema.orders.orders);
    });
  }
}
export const mockOrderRepository = new MockOrderRepository();
