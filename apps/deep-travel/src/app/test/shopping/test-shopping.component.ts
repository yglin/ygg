import { Component, OnInit } from '@angular/core';
import { Product } from '@ygg/shared/interfaces';
import { ShoppingService } from '@ygg/shopping/cart';
import { ProgressSpinnerService } from '@ygg/shared/ui-widgets';

@Component({
  selector: 'dpt-test-shopping',
  templateUrl: './test-shopping.component.html',
  styleUrls: ['./test-shopping.component.css']
})
export class TestShoppingComponent implements OnInit {
  constructor(protected shoppingService: ShoppingService, protected spinner: ProgressSpinnerService) {}

  testProduct: Product = {
    name: '家昌哥豆花打屁自由行',
    price: 12345
  };

  ngOnInit() {
  }

  addTestProduct() {
    this.shoppingService.addPurchase(this.testProduct);
  }
}
