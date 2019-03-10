import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaymentMethod } from '@ygg/shared/interfaces';
import { Payment } from './payment';
import { DataAccessService } from '@ygg/shared/data-access';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  collection = 'payments';

  constructor(protected dataAccessService: DataAccessService) {}

  get$(id: string): Observable<Payment> {
    return this.dataAccessService
      .get$(this.collection, id, Payment);
  }

  upsert(payment: Payment): Promise<Payment> {
    return this.dataAccessService
      .upsert(this.collection, payment, Payment);
  }

  createPayment(
    methodId: string,
    amount: number,
    orderId: string,
    ownerId: string
  ): Promise<Payment> {
    const payment = new Payment();
    payment.amount = amount;
    payment.orderId = orderId;
    payment.ownerId = ownerId;
    payment.methodId = methodId;
    return this.upsert(payment);
  }

  // TODO: Should fetch from backend server configs
  getPaymentMethods(): Observable<PaymentMethod[]> {
    return of([
      {
        id: 'ecpay',
        name: 'Ecpay 綠界科技',
        description: '透過綠界科技所提供的第三方支付功能，將導向到綠界的網頁',
        active: true
      },
      {
        id: 'under-table',
        name: '手動付款',
        description:
          '請手動付款給我們的管理者，管理者確認收款之後會更新訂單狀態',
        active: true
      }
    ]);
  }
}
