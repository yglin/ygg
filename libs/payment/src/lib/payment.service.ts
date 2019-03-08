import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaymentMethod } from '@ygg/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

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
        description: '請手動付款給我們的管理者，管理者確認收款之後會更新訂單狀態',
        active: true
      }
    ]);
  }

}
