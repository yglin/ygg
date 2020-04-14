import { isEmpty, noop, remove, sumBy, get } from 'lodash';
import { Component, OnInit, OnDestroy, Input, forwardRef } from '@angular/core';
import { Purchase, PurchaseAgent } from '@ygg/shopping/core';
import { Subscription, Observable, of, combineLatest, Subject } from 'rxjs';
// import { ShoppingCartService } from '@ygg/shopping/factory';
import { tap, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { YggDialogService } from '@ygg/shared/ui/widgets';
// import { PurchaseControlComponent } from '../../purchase';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { PageResolverService } from '@ygg/shared/ui/navigation';
import { IInputShoppingCart } from './shopping-cart-editor.component.po';
import {
  TheThingFinderComponent,
  IInputTheThingFinder
} from '@ygg/the-thing/ui';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { IConsumer } from 'libs/shopping/core/src/lib/models/consumer';
import { AuthenticateService } from '@ygg/shared/user/ui';

@Component({
  selector: 'ygg-shopping-cart-editor',
  templateUrl: './shopping-cart-editor.component.html',
  styleUrls: ['./shopping-cart-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShoppingCartEditorComponent),
      multi: true
    }
  ]
})
export class ShoppingCartEditorComponent
  implements OnInit, OnDestroy, ControlValueAccessor, IInputShoppingCart {
  emitChange: (value: Purchase[]) => any = noop;
  purchases: Purchase[] = [];
  consumer: IConsumer;
  productFilter: TheThingFilter;
  purchaseAgent: PurchaseAgent;
  totalCharge: number;
  purchasesDataSource: MatTableDataSource<Purchase>;
  displayedColumns: string[];
  // asyncPurchasesData: { [purchaseId: string]: { price?: number } } = {};
  subscriptions: Subscription[] = [];
  clearButtonDisabled = true;
  isPage = false;

  constructor(
    private pageResolver: PageResolverService,
    private theThingAccessService: TheThingAccessService,
    private authService: AuthenticateService,
    // protected shoppingCartService: ShoppingCartService,
    private dialog: YggDialogService
  ) {
    this.totalCharge = 0;
    this.displayedColumns = ['product', 'quantity', 'charge', 'management'];
    this.purchasesDataSource = new MatTableDataSource<Purchase>([]);
  }

  writeValue(value: Purchase[]) {
    this.purchases = isEmpty(value) ? [] : value;
    this.purchasesDataSource.data = this.purchases;
    this.clearButtonDisabled = this.purchases.length < 3;
    this.evalTotalCharge();
  }

  registerOnChange(fn: any) {
    this.emitChange = fn;
  }

  registerOnTouched(fn: any) {}

  ngOnInit() {
    if (this.pageResolver.isPending()) {
      this.isPage = true;
      const pageInput: IInputShoppingCart = this.pageResolver.getInput();
      if (pageInput) {
        this.purchases = pageInput.purchases || [];
        this.productFilter = pageInput.productFilter;
        this.consumer = pageInput.consumer;
      }
      this.writeValue(this.purchases);
    }
    if (!this.consumer) {
      this.consumer = this.authService.currentUser;
    }
    this.purchaseAgent = new PurchaseAgent(
      this.consumer,
      this.theThingAccessService
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  evalTotalCharge() {
    this.totalCharge = sumBy(this.purchases, _purchase => _purchase.charge);
  }

  removePurchase(purchase: Purchase) {
    remove(this.purchases, _purchase => _purchase.id === purchase.id);
    this.purchasesDataSource.data = this.purchases;
    this.emitChange(this.purchases);
    this.evalTotalCharge();
    this.clearButtonDisabled = this.purchases.length < 3;
  }

  addPurchases() {
    const finderInputs: IInputTheThingFinder = {
      filter: this.productFilter
    };
    const dialogRef = this.dialog.open(TheThingFinderComponent, {
      title: '購買新品項',
      data: finderInputs
    });
    dialogRef.afterClosed().subscribe(async (products: TheThing[]) => {
      console.log('Select products~!!!');
      console.dir(products);
      if (!isEmpty(products)) {
        for (const product of products) {
          const newPurchases: Purchase[] = await this.purchaseAgent.purchaseTheThing(
            product,
            1
          );
          console.log('New purchases');
          console.dir(newPurchases);
          this.purchases.push(...newPurchases);
        }
        this.writeValue(this.purchases);
      }
    });
  }

  removeAll() {
    if (confirm('清除所有購買項目？')) {
      this.purchases = [];
      this.purchasesDataSource.data = this.purchases;
      this.emitChange(this.purchases);
      this.evalTotalCharge();
      this.clearButtonDisabled = this.purchases.length < 3;
    }
  }

  onChangeQuantity(purchase: Purchase, value: number) {
    purchase.quantity = value;
    // console.log(`Fuck, typeof quantity input ${typeof value}`);
    this.emitChange(this.purchases);
    this.evalTotalCharge();
  }

  submit() {
    const confirmMessage = '確定以下購買資料正確？';
    if (confirm(confirmMessage)) {
      if (this.pageResolver.isPending()) {
        this.pageResolver.back({ purchases: this.purchases });
      }
    }
  }
}
