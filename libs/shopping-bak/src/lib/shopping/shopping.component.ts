import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { ShoppingService } from '../shopping.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'ygg-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent {
  step1Completed: boolean;
  contactFormGroup: FormGroup;

  constructor(
    protected shoppingService: ShoppingService,
    protected formBuilder: FormBuilder,
    protected router: Router
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

  checkout() {
    this.shoppingService.backup();
    this.shoppingService.checkout().then(order => {
      this.router.navigate(['orders', order.id]);
    });
  }
}
