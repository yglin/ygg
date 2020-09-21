import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaymentMethod, Purchase } from '@ygg/shared/interfaces';
import { Payment } from '@ygg/shared/interfaces';
import { DataAccessService } from '@ygg/shared/data-access';
import { first, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  apiUrl =
    'https://us-central1-develop-289806.cloudfunctions.net/api/payments';
  collection = 'payments';

  constructor(
    protected http: HttpClient,
    protected dataAccessService: DataAccessService
  ) {}

  get$(id: string): Observable<Payment> {
    return this.dataAccessService.get$(this.collection, id, Payment);
  }

  upsert(payment: Payment): Promise<Payment> {
    return this.dataAccessService.upsert(this.collection, payment, Payment);
  }

  createPayment(
    methodId: string,
    purchases: Purchase[],
    amount: number,
    orderId: string,
    ownerId: string
  ): Promise<Payment> {
    const payment = new Payment().fromData({
      methodId,
      purchases,
      amount,
      orderId,
      ownerId
    });
    return this.http
      .post(this.apiUrl, payment.toData())
      .pipe(first())
      .toPromise()
      .then(data => {
        return new Payment().fromData(data);
      });
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
