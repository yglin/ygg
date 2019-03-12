import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { Payment } from '../../payment';
import { EcpayOrder, EcpayService } from '@ygg/shared/utils/ecpay';

@Component({
  selector: 'ygg-payment-ecpay',
  templateUrl: './payment-ecpay.component.html',
  styleUrls: ['./payment-ecpay.component.css']
})
export class PaymentEcpayComponent implements OnInit {
  @Input() payment: Payment;
  ecpayOrder: EcpayOrder;
  agree = false;

  constructor(
    protected renderer: Renderer2,
    protected ecpayService: EcpayService
  ) {}

  ngOnInit() {
    if (this.payment) {
      this.ecpayService.createEcpayOrder(this.payment).then(ecpayOrder => {
        if (ecpayOrder) {
          this.ecpayOrder = ecpayOrder;
        }
      });
    }
  }

  submitToEcpay() {
    const orderParams = this.ecpayOrder.toParams();
    const form = this.renderer.createElement('form');
    this.renderer.setAttribute(form, 'action', this.ecpayService.config.interfaceUrl);
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
