import { isEmpty, noop, remove, sumBy } from 'lodash';
import { Component, OnInit, OnDestroy, Input, forwardRef } from '@angular/core';
import { Purchase } from '@ygg/shopping/core';
import { Subscription, Observable, of, combineLatest, Subject } from 'rxjs';
// import { ShoppingCartService } from '@ygg/shopping/factory';
import { tap, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { YggDialogService } from '@ygg/shared/ui/widgets';
// import { PurchaseControlComponent } from '../../purchase';
import { TheThing } from '@ygg/the-thing/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

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
  implements OnInit, OnDestroy, ControlValueAccessor {
  emitChange: (value: Purchase[]) => any = noop;
  purchases: Purchase[] = [];
  totalCharge: number;
  purchasesDataSource: MatTableDataSource<Purchase>;
  displayedColumns: string[];
  // asyncPurchasesData: { [purchaseId: string]: { price?: number } } = {};
  subscriptions: Subscription[] = [];
  clearButtonDisabled = true;

  constructor() // protected shoppingCartService: ShoppingCartService,
  // private dialog: YggDialogService
  {
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
    // if (this.rootPurchase) {
    //   this.subscriptions.push(
    //     this.purchaseService.evalPurchase$(this.rootPurchase).subscribe(() => {
    //       this.totalCharge = this.purchaseService.evalCharge(this.rootPurchase);
    //       this.purchasesDataSource.data = this.purchaseService.listSubPurchases(
    //         this.cart
    //       );
    //     })
    //   );
    // }
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

  // editPurchase(purchase: Purchase) {
  //   const clonePurchase = this.purchaseService.clonePurchase(purchase);
  //   const dialogRef = this.dialog.open(ShoppingCartEditorComponent, {
  //     title: '修改購買項目',
  //     data: {
  //       clonePurchase
  //     }
  //   });
  //   this.subscriptions.push(
  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         this.purchaseService.updatePurchase(purchase, result);
  //       }
  //     })
  //   );
  // }

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
}
