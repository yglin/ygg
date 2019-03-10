import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Purchase } from '@ygg/order';
import { ShoppingService } from '../../shopping.service';

@Component({
  selector: 'ygg-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  totalPrice: number;
  purchasesDataSource: MatTableDataSource<Purchase>;
  displayedColumns: string[];

  constructor(protected shoppingService: ShoppingService) {
    this.totalPrice = 0;
    this.displayedColumns = ['product', 'quantity', 'price', 'management'];
    this.purchasesDataSource = new MatTableDataSource<Purchase>(
      this.shoppingService.purchases
    );
    shoppingService.purchasesChange.subscribe(purchases => {
      this.purchasesDataSource.data = purchases;
      this.totalPrice = _.sum(
        purchases.map(purchase => purchase.product.price * purchase.quantity)
      );
    });
  }

  ngOnInit() {}

  removePurchase(index: number) {
    this.shoppingService.removePurchase(index);
  }

  onChangeQuantity(index: number, value: number) {
    this.shoppingService.changeQuantity(index, value);
  }
}
