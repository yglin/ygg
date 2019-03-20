import { Component, OnInit, Renderer2 } from '@angular/core';
import { EcpayOrder } from '@ygg/shared/utils/ecpay';
import { Payment } from '@ygg/shared/interfaces';

@Component({
  selector: 'yggtest-ecpay-send-order',
  templateUrl: './ecpay-send-order.component.html',
  styleUrls: ['./ecpay-send-order.component.css']
})
export class EcpaySendOrderComponent implements OnInit {
  payment: Payment;

  constructor(protected renderer: Renderer2) {
    this.payment = new Payment().fromData({
      amount: 12345,
      purchases: [
        {
          product: {
            name: '玻璃心',
            price: 100
          },
          quantity: 1
        },
        {
          product: {
            name: '消痣丸',
            price: 1200
          },
          quantity: 3
        }
      ]
    });
  }

  ngOnInit() {}

  submit() {
    const ecpayConfig = {
      HashIV: 'v77hoKGq4kWxNNIS',
      HashKey: '5294y06JbISpM5x9',
      MerchantID: '2000132',
      MerchantName: 'YGG',
      ReturnURL:
        'https://us-central1-localhost-146909.cloudfunctions.net/api/payment/paid/ecpay',
      interfaceUrl: 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'
    };
    const order = new EcpayOrder(ecpayConfig).fromPayment(this.payment);
    const orderParams = order.toParams();
    const form = this.renderer.createElement('form');
    this.renderer.setAttribute(form, 'action', ecpayConfig.interfaceUrl);
    this.renderer.setAttribute(form, 'method', 'POST');
    this.renderer.setAttribute(form, 'target', '_blank');
    this.renderer.setStyle(form, 'display', 'none');
    for (const key in orderParams) {
      if (orderParams.hasOwnProperty(key)) {
        const value = orderParams[key];
        // const typeAttr = (typeof value === 'number') ? 'type="number"' : '';
        // const inputHtml = `<input name="${key}" ${typeAttr} val="${value}">`;
        const input = this.renderer.createElement('input');
        this.renderer.setAttribute(input, 'name', key);
        this.renderer.setAttribute(input, 'value', value);
        if (typeof value === 'number') {
          this.renderer.setAttribute(input, 'type', 'number');
        }
        this.renderer.appendChild(form, input);
      }
    }
    this.renderer.appendChild(document.body, form);
    // console.dir(form.innerHTML);
    console.log('Submit below data to Ecpay');
    console.dir(orderParams);
    form.submit();
    this.renderer.removeChild(document.body, form);
  }
}
