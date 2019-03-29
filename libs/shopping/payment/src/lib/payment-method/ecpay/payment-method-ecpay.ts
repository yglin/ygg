import { PaymentMethod, PaymentMethodConfig } from '../payment-method';
import { PaymentError } from '../../payment-error';
import { EcpayConfig, EcpayOrder } from './ecpay';
import { Payment } from '@ygg/shared/interfaces';

export class PaymentMethodEcpay implements PaymentMethod {
  config: EcpayConfig;

  constructor(config: any) {
    this.config = config;
  }

  isActive(): boolean {
    return this.config.isActive === true;
  }

  createParams(paymentData: Payment): any {
    const ecpayOrder = new EcpayOrder(this.config, paymentData);
    return ecpayOrder.toParams();
  }

  checkPaid(paymentData: any, paymentResult: any): PaymentError[] {
    const errors = [];
    if (!(paymentResult.RtnCode === 1 || paymentResult.RtnCode === "1")) {
      errors.push(new Error(
        `Payment failed due to RtnCode: ${paymentResult.RtnCode}`
      ));
    }
    const thisCheckMac = EcpayOrder.encodeCheckMac(paymentResult, this.config.HashKey, this.config.HashIV);
    if (thisCheckMac !== paymentResult.CheckMacValue) {
      errors.push(new Error(
        `Payment failed on incorrect CheckMacValue: Received ${
          paymentResult.CheckMacValue
        }, but local derives ${thisCheckMac}`
      ));
    }
    return errors;
  }

  getPaymentId(paymentResult: any): string {
    return paymentResult.CustomField1;
  }
}