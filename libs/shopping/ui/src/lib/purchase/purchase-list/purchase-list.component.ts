import { isEmpty, sumBy, sum } from 'lodash';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { Purchase } from '@ygg/shopping/core';
import { ShoppingCartService } from '@ygg/shopping/factory';
import { Subscription, Observable, of, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ygg-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() purchases: Purchase[];
  totalPrice = 0;
  subscriptions: Subscription[] = [];
  flattenPurchases: { [id: string]: Purchase[] } = {};
  purchases$: BehaviorSubject<Purchase[]> = new BehaviorSubject([]);

  constructor(private shoppingCart: ShoppingCartService) {
    this.subscriptions.push(
      this.purchases$
        // .pipe(
        //   switchMap(purchases => {
        //     return this.shoppingCart.evaluateTotalPrice$(purchases);
        //   })
        // )
        .subscribe(purchases => {
          this.flattenPurchases = {};
          if (!isEmpty(purchases)) {
            purchases.forEach(p => {
              this.flattenPurchases[p.id] = this.flatten(p);
            });
          }
          this.totalPrice = sum(purchases.map(p => p.totalPrice));
        })
    );
  }

  ngOnInit() {
    this.purchases$.next(this.purchases);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.purchases$.next(changes.purchases.currentValue);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  flatten(purchase: Purchase): Purchase[] {
    const result = [];
    result.push(purchase);
    if (!isEmpty(purchase.children)) {
      purchase.children.forEach(c => {
        result.push(...this.flatten(c));
      });
    }
    return result;
  }
}
