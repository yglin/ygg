import { Component, OnInit, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {
  @Input() price: number;
  @Input() value = 0;

  constructor() {}

  ngOnInit() {
    if (this.price && !this.value) {
      this.value = this.price;
    }
  }
}
