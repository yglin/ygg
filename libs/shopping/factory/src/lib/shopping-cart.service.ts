import { remove, sum, isEmpty } from 'lodash';
import { Injectable } from '@angular/core';
import { Purchase } from '../../../core/src/lib/purchase';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProductService } from '@ygg/shopping/data-access';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  purchases: Purchase[];
  purchases$: BehaviorSubject<Purchase[]>;

  constructor(private productService: ProductService) {
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

  evaluatePrice$(purchase: Purchase): Observable<number> {
    return this.productService
      .get$(purchase.productType, purchase.productId)
      .pipe(
        map(product => {
          return product.price * purchase.quantity;
        })
      );
  }

  evaluateTotalPrice$(purchases: Purchase[]): Observable<number> {
    if (isEmpty(purchases)) {
      return of(0);
    } else {
      return combineLatest(
        purchases.map(purchase => this.evaluatePrice$(purchase))
      ).pipe(map(prices => sum(prices)));
    }
  }
}
