import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticateService } from '@ygg/shared/user/ui';
import { Purchase } from '@ygg/shopping/core';
// import { PurchaseControlComponent } from '../../purchase';
import { TheThingFilter, TheThing } from '@ygg/the-thing/core';
import { IConsumer } from 'libs/shopping/core/src/lib/models/consumer';
import { isEmpty, noop } from 'lodash';
import { merge, Subscription } from 'rxjs';
// import { ShoppingCartService } from '@ygg/shopping/factory';
import { tap } from 'rxjs/operators';
import {
  ShoppingCartService,
  ErrorMessagesMap
} from '../../shopping-cart.service';

@Component({
  selector: 'ygg-shopping-cart-editor',
  templateUrl: './shopping-cart-editor.component.html',
  styleUrls: ['./shopping-cart-editor.component.css']
  // providers: [
  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     useExisting: forwardRef(() => ShoppingCartEditorComponent),
  //     multi: true
  //   }
  // ]
})
// , ControlValueAccessor, IInputShoppingCart
export class ShoppingCartEditorComponent implements OnInit, OnDestroy {
  emitChange: (value: Purchase[]) => any = noop;
  // purchases: Purchase[] = [];
  consumer: IConsumer;
  productFilter: TheThingFilter;
  // purchaseAgent: PurchaseAgent;
  totalCharge: number;
  purchasesDataSource: MatTableDataSource<Purchase>;
  displayedColumns: string[];
  // asyncPurchasesData: { [purchaseId: string]: { price?: number } } = {};
  subscriptions: Subscription[] = [];
  clearButtonDisabled = false; // Always enable
  canSubmit = false;
  submitTarget: TheThing = null;
  errorMessages: { [purchaseId: string]: ErrorMessagesMap } = {};

  constructor(
    private authService: AuthenticateService,
    private shoppingCart: ShoppingCartService
  ) {
    this.submitTarget = this.shoppingCart.order || null;
    this.totalCharge = 0;
    this.displayedColumns = ['product', 'quantity', 'charge', 'management'];
    this.purchasesDataSource = new MatTableDataSource<Purchase>([]);
    const purchasesChange$ = this.shoppingCart.purchases$.pipe(
      tap(purchases => {
        this.purchasesDataSource.data = purchases;
        // this.clearButtonDisabled = purchases.length < 3;
        this.canSubmit = !isEmpty(purchases);
        this.errorMessages = {};
        this.assessPurchases(purchases);
      })
    );
    const totalCharge$ = this.shoppingCart.totalCharge$.pipe(
      tap(totalCharge => (this.totalCharge = totalCharge))
    );

    this.subscriptions.push(merge(purchasesChange$, totalCharge$).subscribe());
  }

  // writeValue(value: Purchase[]) {
  //   this.purchases = isEmpty(value) ? [] : value;
  //   this.purchasesDataSource.data = this.purchases;
  //   this.clearButtonDisabled = this.purchases.length < 3;
  //   this.evalTotalCharge();
  // }

  // registerOnChange(fn: any) {
  //   this.emitChange = fn;
  // }

  // registerOnTouched(fn: any) {}

  ngOnInit() {
    // Initially get evaluated total charge
    // this.shoppingCart.evaluateTotalCharge();
    this.shoppingCart.shoppingCartVisited$.next(true);
    // if (this.pageResolver.isPending()) {
    //   this.isPage = true;
    //   const pageInput: IInputShoppingCart = this.pageResolver.getInput();
    //   if (pageInput) {
    //     this.purchases = pageInput.purchases || [];
    //     this.productFilter = pageInput.productFilter;
    //     this.consumer = pageInput.consumer;
    //   }
    //   this.writeValue(this.purchases);
    // }
    if (!this.consumer) {
      this.consumer = this.authService.currentUser;
    }
    // this.purchaseAgent = new PurchaseAgent(
    //   this.consumer,
    //   this.theThingAccessService
    // );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // evalTotalCharge() {
  //   this.totalCharge = sumBy(this.purchases, _purchase => _purchase.charge);
  // }

  removePurchase(purchase: Purchase) {
    // remove(this.purchases, _purchase => _purchase.id === purchase.id);
    // this.purchasesDataSource.data = this.purchases;
    // this.emitChange(this.purchases);
    // this.evalTotalCharge();
    this.shoppingCart.removePurchase(purchase);
  }

  // addPurchases() {
  //   const finderInputs: IInputTheThingFinder = {
  //     filter: this.productFilter
  //   };
  //   const dialogRef = this.dialog.open(TheThingFinderComponent, {
  //     title: '購買新品項',
  //     data: finderInputs
  //   });
  //   dialogRef.afterClosed().subscribe(async (products: TheThing[]) => {
  //     console.log('Select products~!!!');
  //     console.dir(products);
  //     if (!isEmpty(products)) {
  //       for (const product of products) {
  //         const newPurchases: Purchase[] = await this.purchaseAgent.purchaseTheThing(
  //           product,
  //           1
  //         );
  //         console.log('New purchases');
  //         console.dir(newPurchases);
  //         this.purchases.push(...newPurchases);
  //       }
  //       this.writeValue(this.purchases);
  //     }
  //   });
  // }

  removeAll() {
    this.shoppingCart.removeAll();
    // if (confirm('清除所有購買項目？')) {
    //   this.purchases = [];
    //   this.purchasesDataSource.data = this.purchases;
    //   this.emitChange(this.purchases);
    //   this.evalTotalCharge();
    //   this.clearButtonDisabled = this.purchases.length < 3;
    // }
  }

  onChangeQuantity(purchase: Purchase, value: number) {
    this.shoppingCart.changeQuantity(purchase, value);
    this.assessPurchases([purchase]);
    // purchase.quantity = value;
    // // console.log(`Fuck, typeof quantity input ${typeof value}`);
    // this.emitChange(this.purchases);
    // this.evalTotalCharge();
  }

  assessPurchases(purchases: Purchase[]) {
    for (const purchase of purchases) {
      this.errorMessages[purchase.id] = this.shoppingCart.assessPurchase(
        purchase
      );
    }
  }

  submit() {
    this.shoppingCart.submit();
    // const confirmMessage = '確定以下購買資料正確？';
    // if (confirm(confirmMessage)) {
    //   if (this.pageResolver.isPending()) {
    //     this.pageResolver.back({ purchases: this.purchases });
    //   }
    // }
  }
}
