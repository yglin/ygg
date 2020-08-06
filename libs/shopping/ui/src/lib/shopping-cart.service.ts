import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EmceeService, YggDialogService } from '@ygg/shared/ui/widgets';
import {
  evalTotalChargeFromPurchases,
  Purchase,
  PurchaseAction
} from '@ygg/shopping/core';
import { PurchaseService } from '@ygg/shopping/factory';
import { TheThing } from '@ygg/the-thing/core';
import {
  TheThingAccessService,
  TheThingFactoryService
} from '@ygg/the-thing/ui';
import { isEmpty, keyBy, values } from 'lodash';
import {
  BehaviorSubject,
  merge,
  Observable,
  Subject,
  Subscription
} from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { PurchaseProductComponentInput } from './purchase';
import { PurchaseProductComponent } from './purchase/purchase-product/purchase-product.component';

export interface CartSubmitPack {
  order?: TheThing;
  purchases: Purchase[];
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService implements OnDestroy {
  purchases: { [productId: string]: Purchase } = {};
  purchases$: BehaviorSubject<Purchase[]> = new BehaviorSubject([]);
  quantityChange$: Subject<any> = new Subject();
  totalCharge$: Observable<number>;
  shoppingCartVisited$: Subject<boolean> = new Subject();
  submit$: Subject<CartSubmitPack> = new Subject();
  subscriptions: Subscription[] = [];
  order: TheThing;

  constructor(
    private emcee: EmceeService,
    private purchaseService: PurchaseService,
    private theThingAccessor: TheThingAccessService,
    private theThingFactory: TheThingFactoryService,
    private dialog: YggDialogService,
    private router: Router
  ) {
    this.totalCharge$ = merge(this.purchases$, this.quantityChange$).pipe(
      switchMap(() => evalTotalChargeFromPurchases(values(this.purchases)))
    );

    // console.log('Subscribe to theThingFactory.runAction$');
    const addToCart$ = this.theThingFactory.runAction$.pipe(
      tap(actionPack => {
        // console.log(actionPack);
        if (actionPack.action.id === PurchaseAction.id) {
          this.add(actionPack.theThing);
        }
      })
    );
    this.subscriptions.push(addToCart$.subscribe());
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async add(product: TheThing) {
    if (product.id in this.purchases) {
      await this.emcee.warning(`${product.name} 已經在購物車中了`);
      return;
    }

    const purchases: Purchase[] = await this.purchaseService.purchase(product);
    // console.dir(purchases);
    const dialogData: PurchaseProductComponentInput = {
      purchases
    };

    const purchaseDialog = this.dialog.open(PurchaseProductComponent, {
      title: `訂購${product.name}`,
      data: dialogData
    });
    purchaseDialog.afterClosed().subscribe(_purchases => {
      if (!isEmpty(_purchases)) {
        for (const purchase of _purchases) {
          this.purchases[purchase.productId] = purchase;
        }
        this.purchases$.next(values(this.purchases));
      }
    });
  }

  async changeQuantity(purchase: Purchase, value: number) {
    if (purchase.productId in this.purchases) {
      this.purchases[purchase.productId].quantity = value;
      this.quantityChange$.next();
    }
  }

  async removePurchase(purchase: Purchase) {
    try {
      const product = await this.theThingAccessor.load(purchase.productId);
      const confirm = await this.emcee.confirm(
        `確定要移除購買項目：${product.name}？`
      );
      if (confirm && purchase.productId in this.purchases) {
        delete this.purchases[purchase.productId];
      }
      this.purchases$.next(values(this.purchases));
    } catch (error) {
      this.emcee.error(`移除購買項目發生錯誤，錯誤訊息：\n${error.message}`);
    }
  }

  async removeAll() {
    const confirm = await this.emcee.confirm('確定要移除所有購買項目？');
    if (confirm) {
      this.clear();
      this.purchases$.next([]);
    }
  }

  async importPurchases(purchases: Purchase[]) {
    if (!isEmpty(this.purchases)) {
      const confirm = await this.emcee.confirm(
        '原本在購物車中的購買項目將會被清除，是否繼續？'
      );
      if (confirm) {
        this.clear();
      } else {
        return;
      }
    }
    this.purchases = keyBy(purchases, 'productId');
    this.purchases$.next(values(this.purchases));
    this.router.navigate(['/', 'shopping', 'cart']);
  }

  import(order: TheThing, purchases: Purchase[]) {
    this.order = order;
    this.importPurchases(purchases);
  }

  submit() {
    // console.info('Submit shopping cart~!!!');
    this.submit$.next({
      order: this.order,
      purchases: values(this.purchases)
    });
    this.clear();
  }

  clear() {
    this.purchases = {};
  }
}
