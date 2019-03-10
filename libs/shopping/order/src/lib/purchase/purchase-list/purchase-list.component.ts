import { Component, OnInit, Input } from '@angular/core';
import { Purchase } from '../purchase';

@Component({
  selector: 'ygg-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit {
  @Input() purchases: Purchase[];

  constructor() { }

  ngOnInit() {
  }

}
