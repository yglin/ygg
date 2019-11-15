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
import { Subscription, Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ygg-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit, OnDestroy {
  @Input() purchases: Purchase[];
  totalPrice = 0;
  subscriptions: Subscription[] = [];

  constructor(private shoppingCartService: ShoppingCartService) {}

  async ngOnInit() {
    let purchases$: Observable<Purchase[]>;
    if (this.purchases) {
      purchases$ = of(this.purchases);
    } else {
      purchases$ = this.shoppingCartService.purchases$;
    }
    this.subscriptions.push(
      purchases$
        .pipe(
          tap(purchases => (this.purchases = purchases)),
          switchMap(purchases =>
            this.shoppingCartService.evaluateTotalPrice$(purchases)
          ),
          tap(totalPrice => (this.totalPrice = totalPrice))
        )
        .subscribe()
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
