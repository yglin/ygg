import { Component, OnInit, Input } from '@angular/core';
import { PaymentService } from '../payment.service';
import { Payment } from '@ygg/shared/interfaces';

@Component({
  selector: 'ygg-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @Input() paymentId: string;
  @Input() payment: Payment;

  constructor(protected paymentService: PaymentService) {}

  ngOnInit() {
    if (!this.payment && this.paymentId) {
      this.paymentService.get$(this.paymentId).subscribe(payment => {
        this.payment = payment;
      });
    }
  }

  getTypeMessage(type: string) {
    switch (type) {
      case 'send':
        return '傳送付款資料';
      case 'fail':
        return '付款失敗';
      case 'success':
        return '付款成功';
      default:
        return '未知的紀錄';
    }
  }
}
