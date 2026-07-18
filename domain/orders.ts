export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKE_AWAY = 'TAKE_AWAY',
  DELIVERY = 'DELIVERY'
}

export enum OrderStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItemModifier {
  optionId: string;
  name: string;
  priceRial: number; // Integer IRR
}

export interface OrderItem {
  id: string; // UUID-like string
  productId: string;
  name: string;
  quantity: number;
  unitPriceRial: number; // Integer IRR
  modifiers: OrderItemModifier[];
  subtotalRial: number; // Integer IRR
}

export interface DineInContext {
  tableNumber: number;
  qrCodeUrl?: string;
  capacity?: number;
}

export interface CustomerOrder {
  id: string; // UUID-like string
  branchId: string;
  orderType: OrderType;
  dineInTable?: DineInContext; // branch/table context info for DINE_IN
  items: OrderItem[];
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  subtotalRial: number; // Integer IRR
  taxRial: number; // Integer IRR
  deliveryFeeRial?: number; // Integer IRR
  grandTotalRial: number; // Integer IRR
  status: OrderStatus;
  paymentId?: string; // payment model ID, separated status
  publicCode: string; // customer-facing order reference (e.g. unique hash or clean public token)
  displayNumber: string; // staff display reference (e.g. Snappy counter like #12)
  createdAt: string;
  updatedAt: string;
}
