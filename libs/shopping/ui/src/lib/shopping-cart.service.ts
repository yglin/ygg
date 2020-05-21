import { Injectable } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { Purchase, evalTotalChargeFromPurchases } from '@ygg/shopping/core';
import { EmceeService, YggDialogService } from '@ygg/shared/ui/widgets';
import { PurchaseProductComponent } from './purchase/purchase-product/purchase-product.component';
import { PurchaseProductComponentInput } from './purchase';
import { isEmpty, values, keyBy } from 'lodash';
import { PurchaseService } from '@ygg/shopping/factory';
import { BehaviorSubject, Subject, Observable, merge } from 'rxjs';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  purchases: { [productId: string]: Purchase } = {};
  purchases$: BehaviorSubject<Purchase[]> = new BehaviorSubject([]);
  quantityChange$: Subject<any> = new Subject();
  totalCharge$: Observable<number>;
  shoppingCartVisited$: Subject<boolean> = new Subject();
  submit$: Subject<Purchase[]> = new Subject();

  constructor(
    private emcee: EmceeService,
    private purchaseService: PurchaseService,
    private theThingAccessor: TheThingAccessService,
    private dialog: YggDialogService,
    private router: Router
  ) {
    this.totalCharge$ = merge(this.purchases$, this.quantityChange$).pipe(
      switchMap(() => evalTotalChargeFromPurchases(values(this.purchases)))
    );
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
    purchaseDialog.afterClosed().subscribe(purchases => {
      if (!isEmpty(purchases)) {
        for (const purchase of purchases) {
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
      const product = await this.theThingAccessor.get(purchase.productId);
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
      this.purchases = {};
      this.purchases$.next([]);
    }
  }

  async importPurchases(purchases: Purchase[]) {
    if (!isEmpty(this.purchases)) {
      const confirm = await this.emcee.confirm(
        '原本在購物車中的購買項目將會被清除，是否繼續？'
      );
      if (confirm) {
        this.purchases = {};
      } else {
        return;
      }
    }
    this.purchases = keyBy(purchases, 'productId');
    this.purchases$.next(values(this.purchases));
    this.router.navigate(['/', 'shopping', 'cart']);
  }

  submit() {
    // console.info('Submit shopping cart~!!!');
    this.submit$.next(values(this.purchases));
  }
}
