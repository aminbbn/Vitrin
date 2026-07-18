export enum PaymentMethod {
  ONLINE = 'ONLINE',
  CARD_READER = 'CARD_READER',
  CASH = 'CASH'
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED'
}

export interface Payment {
  id: string; // UUID-like identifier
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amountRial: number; // Integer IRR
  transactionReference?: string;
  paidAt?: string;
  createdAt: string;
}
