export interface Payment {
  description: string;
  createAt: Date;
  amount: number;
  dueDate: Date;
  paidDate: Date;
  methodId: string;
  isPaid: boolean;
  logs: PaymentLog[];
  orderId: string;
  ownerId?: string;
  auditorId?: string;
}

export interface PaymentLog {
  timestamp: string;
  type: string;
  data: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  active: boolean;
}
