import { Component, OnInit, Input } from '@angular/core';
import { Payment } from '../../payment';

@Component({
  selector: 'ygg-payment-ecpay',
  templateUrl: './payment-ecpay.component.html',
  styleUrls: ['./payment-ecpay.component.css']
})
export class PaymentEcpayComponent implements OnInit {
  @Input() payment: Payment;
  
  constructor() { }

  ngOnInit() {
  }

}
