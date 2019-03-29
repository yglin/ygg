import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { Payment } from '@ygg/shared/interfaces';

@Component({
  selector: 'ygg-payment-ecpay',
  templateUrl: './payment-ecpay.component.html',
  styleUrls: ['./payment-ecpay.component.css']
})
export class PaymentEcpayComponent implements OnInit {
  @Input() payment: Payment;
  orderParams: any;
  interfaceUrl: string;
  agree = false;

  constructor(
    protected renderer: Renderer2,
  ) {}

  ngOnInit() {
    if (this.payment && this.payment.redirectInfo) {
      this.orderParams = this.payment.redirectInfo.data;
      this.interfaceUrl = this.payment.redirectInfo.url;
    }
  }

  submitToEcpay() {
    const form = this.renderer.createElement('form');
    this.renderer.setAttribute(form, 'action', this.interfaceUrl);
    this.renderer.setAttribute(form, 'method', 'POST');
    this.renderer.setAttribute(form, 'target', '_blank');
    this.renderer.setStyle(form, 'display', 'none');
    for (const key in this.orderParams) {
      if (this.orderParams.hasOwnProperty(key)) {
        const value = this.orderParams[key];
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
    console.dir(this.orderParams);
    form.submit();
    this.renderer.removeChild(document.body, form);
  }
}
