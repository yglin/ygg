import { Component, OnInit } from '@angular/core';
import { Product } from '@ygg/shared/interfaces';
import { ShoppingService } from '@ygg/shopping/cart';

@Component({
  selector: 'dpt-test-shopping',
  templateUrl: './test-shopping.component.html',
  styleUrls: ['./test-shopping.component.css']
})
export class TestShoppingComponent implements OnInit {
  constructor(protected shoppingService: ShoppingService) {}

  testProduct: Product = {
    name: '家昌哥豆花打屁自由行',
    price: 12345
  };

  ngOnInit() {}

  addTestProduct() {
    this.shoppingService.addPurchase(this.testProduct);
  }
}
