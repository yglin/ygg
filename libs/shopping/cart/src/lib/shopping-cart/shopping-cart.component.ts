import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ShoppingService } from '../shopping.service';
import { ProgressSpinnerService } from '@ygg/shared/ui-widgets';

@Component({
  selector: 'ygg-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  step1Completed: boolean;
  contactFormGroup: FormGroup;

  constructor(
    protected shoppingService: ShoppingService,
    protected formBuilder: FormBuilder,
    protected router: Router,
    protected spinner: ProgressSpinnerService
  ) {
    this.step1Completed = false;
    this.shoppingService.purchasesChange.subscribe(purchases => {
      this.step1Completed = !_.isEmpty(purchases);
    });
    this.contactFormGroup = this.formBuilder.group({
      contact: this.shoppingService.contact
    });
    this.contactFormGroup.get('contact').valueChanges.subscribe(contact => {
      // console.log(contact);
      if (contact) {
        this.shoppingService.contact = contact;
      }
    });
  }

  get paymentMethodId(): string {
    return this.shoppingService.paymentMethodId;
  }

  set paymentMethodId(value: string) {
    this.shoppingService.paymentMethodId = value;
  }

  confirmPurchases() {
    if (_.isEmpty(this.shoppingService.purchases)) {
      alert('人客您還沒有購買任何商品，是在結心酸的嗎？');
    } else {
      this.shoppingService.backup();
    }
  }

  confirmContact() {
    this.shoppingService.backup();
  }

  async checkout() {
    this.spinner.show();
    try {
      this.shoppingService.backup();
      const order = await this.shoppingService.checkout();
      this.router.navigate(['orders', order.id]);
    } catch (error) {
      console.error(error);
    } finally {
      this.spinner.hide();
    }
  }
}
