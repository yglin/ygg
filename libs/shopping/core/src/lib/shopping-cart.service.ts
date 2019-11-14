import { remove, sumBy, isEmpty } from 'lodash';
import { Injectable } from '@angular/core';
import { Purchase } from './purchase';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  purchases: Purchase[];
  purchases$: BehaviorSubject<Purchase[]>;

  constructor() {
    this.purchases = [];
    this.purchases$ = new BehaviorSubject(this.purchases);
  }

  resetQuantityAll(quantity: number) {
    if (!isEmpty(this.purchases)) {
      for (const purchase of this.purchases) {
        purchase.quantity = quantity;
      }
      this.purchases$.next(this.purchases);
    }
  }

  addPurchase(purchase: Purchase) {
    this.purchases.push(purchase);
    this.purchases$.next(this.purchases);
  }

  removePurchase(purchase: Purchase) {
    remove(this.purchases, value => value === purchase);
    this.purchases$.next(this.purchases);
  }

  removePurchaseAt(index: number) {
    remove(this.purchases, (value, idx) => idx === index);
    this.purchases$.next(this.purchases);
  }

  clear() {
    this.purchases = [];
    this.purchases$.next(this.purchases);
  }

  async evaluateTotalPrice(purchases: Purchase[]): Promise<number> {
    const totalPrice = sumBy(purchases, purchase => purchase.getPrice());
    return Promise.resolve(totalPrice);
  }
}
