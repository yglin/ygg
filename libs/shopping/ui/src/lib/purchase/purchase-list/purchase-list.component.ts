import { isEmpty, sumBy } from "lodash";
import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Purchase, ShoppingCartService } from '@ygg/shopping/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit, OnDestroy {
  @Input() purchases: Purchase[];
  totalPrice = 0;
  subscriptions: Subscription[] = [];

  constructor(private shoppingCartService: ShoppingCartService) { }

  async ngOnInit() {
    if (this.purchases) {
      this.totalPrice = await this.shoppingCartService.evaluateTotalPrice(this.purchases);
    } else {
      this.subscriptions.push(this.shoppingCartService.purchases$.subscribe(async purchases => {
        this.purchases = purchases;
        this.totalPrice = await this.shoppingCartService.evaluateTotalPrice(this.purchases);
      }));
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
