import { Component, OnInit, Input } from '@angular/core';
import { ShoppingService } from '../shopping.service';

@Component({
  selector: 'ygg-shopping-button',
  templateUrl: './shopping-button.component.html',
  styleUrls: ['./shopping-button.component.css']
})
export class ShoppingButtonComponent implements OnInit {
  @Input() tooltip: string;
  numPurchases: number;

  constructor(protected shoppingService: ShoppingService) {
    this.tooltip = 'View Cart';
    this.numPurchases = 0;
    this.shoppingService.purchasesChange.subscribe(
      purchases => (this.numPurchases = purchases.length)
    );
  }

  ngOnInit() {}
}
