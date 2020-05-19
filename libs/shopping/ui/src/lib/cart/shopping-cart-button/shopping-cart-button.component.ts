import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from '../../shopping-cart.service';
import { Subscription } from 'rxjs';
import { isEmpty } from 'lodash';

@Component({
  selector: 'ygg-shopping-cart-button',
  templateUrl: './shopping-cart-button.component.html',
  styleUrls: ['./shopping-cart-button.component.css']
})
export class ShoppingCartButtonComponent implements OnInit, OnDestroy {
  purchaseCount: number = 0;
  subscriptions: Subscription[] = [];
  showBadge = false;

  constructor(private shoppingCart: ShoppingCartService) {
    this.subscriptions.push(
      this.shoppingCart.purchases$.subscribe(purchases => {
        this.purchaseCount = isEmpty(purchases) ? 0 : purchases.length;
        this.showBadge = this.purchaseCount > 0 ? true : false;
      })
    );
    this.subscriptions.push(
      this.shoppingCart.shoppingCartVisited$.subscribe(
        () => (this.showBadge = false)
      )
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
