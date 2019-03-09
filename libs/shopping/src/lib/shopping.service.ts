import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Contact, Product } from '@ygg/interfaces';
import { AuthenticateService } from '@ygg/user';
import { Order, Purchase, OrderService } from '@ygg/order';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  purchases: Purchase[];
  purchasesChange: BehaviorSubject<Purchase[]>;
  contact: Contact;
  paymentMethodId: string;

  constructor(
    protected authenticateService: AuthenticateService,
    protected orderService: OrderService
  ) {
    this.restore();

    _.defaults(this, {
      purchases: [],
      contact: {},
      paymentMethodId: ''
    });

    this.purchasesChange = new BehaviorSubject<Purchase[]>(this.purchases);
    this.purchasesChange.subscribe(() => this.backup());
  }

  addPurchase(product: Product, quantity: number = 1): Promise<Purchase[]> {
    const newPurchase = new Purchase(product, quantity);
    this.purchases.push(newPurchase);
    this.purchasesChange.next(this.purchases);
    alert(`${newPurchase.product.name} 已加入購物車`);
    return Promise.resolve(this.purchases);
  }

  removePurchase(index: number): Promise<Purchase[]> {
    const purchase = this.purchases[index];
    if (
      purchase &&
      confirm(`確定要移除購買項目： ${purchase.product.name} ？`)
    ) {
      this.purchases.splice(index, 1);
      this.purchasesChange.next(this.purchases);
    }
    return Promise.resolve(this.purchases);
  }

  changeQuantity(index: number, quantity: number): Promise<Purchase[]> {
    if (index < 0 || index >= this.purchases.length) {
      alert('找不到購買項目');
      return Promise.reject(
        new Error(`Can not find purchase at index ${index}`)
      );
    }
    this.purchases[index].quantity = quantity;
    this.purchasesChange.next(this.purchases);
    return Promise.resolve(this.purchases);
  }

  backup() {
    try {
      const data = JSON.stringify({
        purchases: this.purchases,
        contact: this.contact,
        paymentMethodId: this.paymentMethodId
      });
      // console.dir(data);
      localStorage.setItem('cart', data);
    } catch (error) {
      console.error(error);
    }
  }

  restore() {
    try {
      const data = JSON.parse(localStorage.getItem('cart'));
      if (data) {
        if (!_.isEmpty(data.purchases)) {
          this.purchases = data.purchases;
          if (this.purchasesChange) {
            this.purchasesChange.next(this.purchases);
          }
        }
        if (!_.isEmpty(data.contact)) {
          this.contact = data.contact;
        }
        if (data.paymentMethodId) {
          this.paymentMethodId = data.paymentMethodId;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  clear() {
    this.purchases = [];
    this.contact = null;
    this.paymentMethodId = '';
    this.purchasesChange.next(this.purchases);
    localStorage.removeItem('cart');
  }

  getCurrentUserId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authenticateService.currentUser$.subscribe(user => {
        // console.log(userId);
        if (user) {
          resolve(user.id);
        } else {
          reject(new Error('User not login yet'));
        }
      });
    });
  }

  checkout(): Promise<Order> {
    return this.getCurrentUserId()
      .then(
        ownerId => {
          return this.orderService.create(
            this.purchases,
            this.contact,
            this.paymentMethodId,
            ownerId
          );
        },
        error => {
          alert('請先登入再結帳');
          return Promise.reject(new Error(`User not login, forbid checkout`));
        }
      )
      .then(order => {
        alert('訂單已產生');
        this.clear();
        return Promise.resolve(order);
      })
      .catch(error => {
        console.error(error);
        return Promise.reject(error);
      });
  }
}
