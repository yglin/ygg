import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Purchase } from '@ygg/shopping/core';
import { ProductService } from '@ygg/shopping/data-access';
import { Subscription, of } from 'rxjs';
import { ShoppingCartService } from '@ygg/shopping/factory';

@Component({
  selector: 'ygg-purchase-thumbnail',
  templateUrl: './purchase-thumbnail.component.html',
  styleUrls: ['./purchase-thumbnail.component.css']
})
export class PurchaseThumbnailComponent implements OnInit, OnDestroy {
  @Input() purchase: Purchase;
  subscriptions: Subscription[] = [];
  price: number;

  constructor(
    private shoppingCart: ShoppingCartService
  ) {}

  ngOnInit() {
    if (this.purchase) {
      this.subscriptions.push(
        this.shoppingCart
          .evaluatePrice$(this.purchase)
          .subscribe(price => (this.price = price))
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
