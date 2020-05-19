import { Component, OnInit, OnDestroy } from '@angular/core';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Purchase, CellNames } from '@ygg/shopping/core';
import { PurchaseProductComponentInput } from './purchase-product.component.po';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { isEmpty } from 'lodash';

@Component({
  selector: 'ygg-purchase-product',
  templateUrl: './purchase-product.component.html',
  styleUrls: ['./purchase-product.component.css']
})
export class PurchaseProductComponent
  implements OnInit, OnDestroy, YggDialogContentComponent {
  CellNames = CellNames;
  purchases: Purchase[] = [];
  dialogData: PurchaseProductComponentInput;
  dialogOutput$: BehaviorSubject<Purchase[]> = new BehaviorSubject([]);
  formGroup: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({});
    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(() =>
        this.dialogOutput$.next(this.purchases)
      )
    );
  }

  ngOnInit() {
    if (this.dialogData && this.dialogData.purchases) {
      this.purchases = this.dialogData.purchases;
      if (!isEmpty(this.purchases)) {
        for (const purchase of this.purchases) {
          const formControl = new FormControl(purchase.quantity);
          this.subscriptions.push(
            formControl.valueChanges.subscribe(
              value => (purchase.quantity = value)
            )
          );
          this.formGroup.setControl(
            `${purchase.productId}_quantity`,
            formControl
          );
        }
      }
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  totalCharge(): number {
    let sum = 0;
    for (const purchse of this.purchases) {
      sum += purchse.charge;
    }
    return sum;
  }
}
