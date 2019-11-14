import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ygg-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {
  @Input() price: number;
  
  constructor() { }

  ngOnInit() {
  }

}
