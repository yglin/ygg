import { PaymentError } from '../payment-error';

export interface PaymentMethodConfig {
  isActive: boolean;
  interfaceUrl: string;
  [property: string]: any;
}

export interface PaymentMethod {
  config: PaymentMethodConfig;

  isActive: () => boolean;
  createParams: (paymentData: any) => any;
  checkPaid: (paymentData: any, paymentResult: any) => PaymentError[];
  getPaymentId: (paymentResult: any) => string;
}

