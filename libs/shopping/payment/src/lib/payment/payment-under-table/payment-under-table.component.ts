import { Component, OnInit, Input } from '@angular/core';
import { Payment } from '../../payment';

@Component({
  selector: 'ygg-payment-under-table',
  templateUrl: './payment-under-table.component.html',
  styleUrls: ['./payment-under-table.component.css']
})
export class PaymentUnderTableComponent implements OnInit {
  @Input() payment: Payment;
  
  constructor() { }

  ngOnInit() {
  }

}
