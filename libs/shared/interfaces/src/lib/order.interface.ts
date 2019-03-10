import { Contact } from './contact.interface';

export interface Product {
  name: string;
  price: number;
  link?: string;
  thumbnail?: string;
  [propName: string]: any;
}

export interface Purchase {
  product: Product;
  quantity: number;
}

export enum OrderState {
  UNKNOWN = -1,
  NEW,
  CONFIRMED,
  PAID,
  COMPLETED,
  CANCELED,
  REFUNDING,
  REFUNDED
}

export interface Order {
  ownerId: string;
  description: string;
  state: OrderState;
  amount: number;
  contact: Contact;
  purchases: Purchase[];
  paymentIds: Set<string>;
}
