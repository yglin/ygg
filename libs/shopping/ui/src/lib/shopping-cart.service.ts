import { Injectable } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { Purchase } from '@ygg/shopping/core';
import { EmceeService, YggDialogService } from '@ygg/shared/ui/widgets';
import { PurchaseProductComponent } from './purchase/purchase-product/purchase-product.component';
import { PurchaseProductComponentInput } from './purchase';
import { isEmpty, values } from 'lodash';
import { PurchaseService } from '@ygg/shopping/factory';
import { BehaviorSubject, Subject } from 'rxjs';
import { TheThingAccessService } from '@ygg/the-thing/data-access';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  purchases: { [productId: string]: Purchase } = {};
  purchases$: BehaviorSubject<Purchase[]> = new BehaviorSubject([]);
  totalCharge$: BehaviorSubject<number> = new BehaviorSubject(0);
  shoppingCartVisited$: Subject<boolean> = new Subject();
  submit$: Subject<Purchase[]> = new Subject();

  constructor(
    private emcee: EmceeService,
    private purchaseService: PurchaseService,
    private theThingAccessor: TheThingAccessService,
    private dialog: YggDialogService
  ) {}

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
      this.evaluateTotalCharge();
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
      this.evaluateTotalCharge();
    } catch (error) {
      this.emcee.error(`移除購買項目發生錯誤，錯誤訊息：\n${error.message}`);
    }
  }

  async evaluateTotalCharge() {
    let totalCharge = 0;
    for (const productId in this.purchases) {
      if (this.purchases.hasOwnProperty(productId)) {
        const purchase = this.purchases[productId];
        totalCharge += purchase.charge;
      }
    }
    this.totalCharge$.next(totalCharge);
  }

  async removeAll() {
    this.purchases = {};
    this.purchases$.next([]);
    this.evaluateTotalCharge();
  }

  submit() {
    this.submit$.next(values(this.purchases));
  }
}
