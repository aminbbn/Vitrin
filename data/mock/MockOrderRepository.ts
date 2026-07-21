import { OrderRepository } from '../contracts/OrderRepository';
import { localStore } from '../../repositories/local/LocalStorageAdapter';

export class MockOrderRepository implements OrderRepository {
  async getOrders(): Promise<any[]> {
    return localStore.load().orders;
  }

  async saveOrders(orders: any[]): Promise<void> {
    const store = localStore.load();
    store.orders = orders;
    localStore.save(store);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const store = localStore.load();
    const index = store.orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      store.orders[index].status = status;
      localStore.save(store);
    }
  }

  async createOrder(order: any): Promise<any> {
    const store = localStore.load();
    store.orders = [order, ...store.orders];
    localStore.save(store);
    return order;
  }

  async getCustomerContext(): Promise<{ name: string; phone: string; table: string }> {
    return localStore.load().customerContext;
  }

  async saveCustomerContext(context: { name: string; phone: string; table: string }): Promise<void> {
    const store = localStore.load();
    store.customerContext = context;
    localStore.save(store);
  }

  subscribeOrders(callback: (orders: any[]) => void): () => void {
    callback(localStore.load().orders);
    return localStore.subscribe((schema) => {
      callback(schema.orders);
    });
  }
}

export const mockOrderRepository = new MockOrderRepository();
