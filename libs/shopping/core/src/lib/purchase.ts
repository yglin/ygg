import { Product } from './product';
import { Duration } from "@ygg/shared/types";

export enum PurchaseState {
  Unknown = -1,
  New,
  Confirmed,
  Complete
}

export class Purchase {
  product: Product;
  quantity: number;
  duration: Duration;
  state: PurchaseState;

  constructor(product: Product, quantity: number, duration?: Duration) {
    this.product = product;
    this.quantity = quantity || 0;
    this.duration = duration;
    this.state = PurchaseState.New;
  }

  getPrice(): number {
    return this.product.price * this.quantity;
  }
}