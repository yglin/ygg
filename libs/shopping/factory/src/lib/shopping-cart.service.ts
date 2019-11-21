import { sum, isEmpty, values } from 'lodash';
import { Injectable } from '@angular/core';
import { Purchase } from '../../../core/src/lib/purchase';
import {
  BehaviorSubject,
  Observable,
  of,
  combineLatest,
  throwError,
  isObservable
} from 'rxjs';
import { map, startWith, switchMap, tap, take } from 'rxjs/operators';
import { ProductService } from '@ygg/shopping/data-access';
import { LogService } from '@ygg/shared/infra/log';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  // purchases: Purchase[];
  purchaseSubjects: {
    [productId: string]: {
      data: Purchase;
      subject$: BehaviorSubject<Purchase>;
    };
  } = {};
  purchases$: BehaviorSubject<Purchase[]>;

  constructor(
    private productService: ProductService,
    private logService: LogService
  ) {
    // this.purchases = [];
    this.purchases$ = new BehaviorSubject([]);
  }

  getPurchases(): Purchase[] {
    return values(this.purchaseSubjects).map(p => p.data);
  }

  resetQuantityAll(quantity: number) {
    for (const purchase of values(this.purchaseSubjects).map(ps => ps.data)) {
      this.setQuantity(purchase, quantity);
    }
  }

  setQuantity(purchase: Purchase, quantity: number) {
    if (this.purchaseSubjects[purchase.productId]) {
      const purchaseSubject = this.purchaseSubjects[purchase.productId];
      purchaseSubject.data.quantity = quantity;
      purchaseSubject.subject$.next(purchaseSubject.data);
    } else {
      const error = new Error(`Not found product id ${purchase.productId}`);
      this.logService.error(error.message);
    }
  }

  addPurchase(purchase: Purchase): Observable<Purchase> {
    if (purchase.productId in this.purchaseSubjects) {
      alert('同品項已在購買清單中，請修改數量');
    } else {
      const purchaseObsrv = new BehaviorSubject(purchase);
      this.purchaseSubjects[purchase.productId] = {
        data: purchase,
        subject$: purchaseObsrv
      };
      // Evaluate price once
      this.evaluatePrice$(purchaseObsrv).pipe(take(1)).subscribe();
      this.purchases$.next(
        values(this.purchaseSubjects).map(subject => subject.data)
      );
    }
    return this.purchaseSubjects[purchase.productId].subject$;
  }

  removePurchase(purchase: Purchase) {
    delete this.purchaseSubjects[purchase.productId];
    this.purchases$.next(
      values(this.purchaseSubjects).map(subject => subject.data)
    );
  }

  clear() {
    this.purchaseSubjects = {};
    this.purchases$.next([]);
  }

  evaluatePrice$(arg1: Observable<Purchase> | Purchase): Observable<number> {
    let purchase$: Observable<Purchase>;
    if (Purchase.isPurchase(arg1)) {
      if (arg1.productId in this.purchaseSubjects) {
        purchase$ = this.purchaseSubjects[arg1.productId].subject$;
      } else {
        purchase$ = of(arg1);
      }
    } else if (isObservable(arg1)) {
      purchase$ = arg1;
    }
    return purchase$.pipe(
      switchMap(purchase => {
        return this.productService
          .get$(purchase.productType, purchase.productId)
          .pipe(map(product => product.price * purchase.quantity), tap(price => purchase.price = price));
      })
    );
  }

  evaluateTotalPrice$(
    purchase$Array: (Observable<Purchase> | Purchase)[]
  ): Observable<number> {
    if (isEmpty(purchase$Array)) {
      return of(0);
    } else {
      const evaluatePrice$Array: Observable<number>[] = purchase$Array.map(p =>
        this.evaluatePrice$(p)
      );
      return combineLatest(evaluatePrice$Array).pipe(
        map(prices => sum(prices))
      );
    }
  }
}
