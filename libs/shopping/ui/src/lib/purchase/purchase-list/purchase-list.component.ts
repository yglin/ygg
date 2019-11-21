import { isEmpty, sumBy } from 'lodash';
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
  purchases$: BehaviorSubject<Purchase[]> = new BehaviorSubject([]);

  constructor(private shoppingCart: ShoppingCartService) {
    this.subscriptions.push(
      this.purchases$
        .pipe(
          switchMap(purchases => {
            return this.shoppingCart.evaluateTotalPrice$(purchases);
          })
        )
        .subscribe(totalPrice => (this.totalPrice = totalPrice))
    );
  }

  async ngOnInit() {
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
}
