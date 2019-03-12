import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map } from 'rxjs/operators';
import { EcpayOrder } from './ecpay-order';
import { Payment } from '@ygg/shared/interfaces';
import { iEcpayConfig, iEcpayOrder } from './ecpay';

@Injectable({
  providedIn: 'root'
})
export class EcpayService {
  backendUrl = '';
  // interfaceUrl = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';
  config: iEcpayConfig;

  constructor(
    protected http: HttpClient
  ) { }

  createEcpayOrder(payment: Payment): Promise<EcpayOrder> {
    return this.http.post(this.backendUrl, {
      payment
    }).pipe(
      first(),
      map(data => new EcpayOrder(data))
    ).toPromise();
    // const order = new EcpayOrder({
    //   MerchantID: '2000132',
    //   MerchantTradeDate: '2013/03/12 15:30:23',
    //   MerchantTradeNo: 'ecpay20130312153023',
    //   ReturnURL: 'https://www.ecpay.com.tw/receive.php',
    //   TotalAmount: 1000,
    //   TradeDesc: '促銷方案',
    //   ItemName: 'Apple iphone 7 手機殼',
    //   CheckMacValue: 'CFA9BDE377361FBDD8F160274930E815D1A8A2E3E80CE7D404C45FC9A0A1E407'
    // });
    // console.log(order);
    // return Promise.resolve(order);
  }
}
