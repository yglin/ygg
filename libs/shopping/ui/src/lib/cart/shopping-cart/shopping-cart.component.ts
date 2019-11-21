import { isEmpty, sum } from 'lodash';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Purchase } from '@ygg/shopping/core';
import { Subscription, Observable, of, combineLatest } from 'rxjs';
import { ShoppingCartService } from '@ygg/shopping/factory';
import { tap, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'ygg-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  @Input() numShare: number;
  totalPrice: number;
  singlePrice: number;
  purchasesDataSource: MatTableDataSource<Purchase>;
  displayedColumns: string[];
  asyncPurchasesData: { [purchaseId: string]: { price?: number } } = {};
  subscriptions: Subscription[] = [];
  clearButtonDisabled = true;

  constructor(protected shoppingCart: ShoppingCartService) {
    this.totalPrice = 0;
    this.displayedColumns = ['product', 'quantity', 'price', 'management'];
    this.purchasesDataSource = new MatTableDataSource<Purchase>([]);

    this.subscriptions.push(
      shoppingCart.purchases$
        .pipe(
          tap(purchases => {
            this.purchasesDataSource.data = purchases;
            this.clearButtonDisabled = purchases.length > 1 ? false : true;
          }),
          switchMap(purchases => {
            this.asyncPurchasesData = {};
            if (isEmpty(purchases)) {
              return of([]);
            } else {
              return combineLatest(
                purchases.map(purchase => {
                  this.asyncPurchasesData[purchase.id] = {};
                  const asyncData = this.asyncPurchasesData[purchase.id];
                  return this.shoppingCart
                    .evaluatePrice$(purchase)
                    .pipe(tap(price => (asyncData.price = price)));
                })
              );
            }
          }),
          tap((prices: number[]) => {
            this.totalPrice = sum(prices);
            if (this.numShare > 1) {
              this.singlePrice = Math.ceil(this.totalPrice / this.numShare);
            } else {
              this.singlePrice = undefined;
            }
          })
        )
        .subscribe()
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  removePurchase(purchase: Purchase) {
    this.shoppingCart.removePurchase(purchase);
  }

  removeAll() {
    if (confirm('清除所有購買項目？')) {
      this.shoppingCart.clear();
    }
  }

  onChangeQuantity(purchase: Purchase, value: number) {
    this.shoppingCart.setQuantity(purchase, value);
  }
}
