import * as _ from 'lodash';
import { PaymentError, PaymentErrorCode } from './payment-error';
import {
  PaymentMethod,
  PaymentMethodConfig
} from './payment-method/payment-method';
import { PaymentMethodEcpay } from './payment-method/ecpay/payment-method-ecpay';
import { Payment, RedircetInfo } from '@ygg/shared/interfaces';

export function createPaymentMethod(
  methodId: string,
  config: PaymentMethodConfig
): PaymentMethod {
  let paymentMethod: PaymentMethod;
  switch (methodId) {
    case 'ecpay':
      paymentMethod = new PaymentMethodEcpay(config);
      break;

    default:
      const errorMessage = `Payment method ${methodId} not implemented`;
      throw new PaymentError(
        PaymentErrorCode.NOT_IMPLEMENT_METHOD,
        errorMessage
      );
      break;
  }

  if (!paymentMethod.isActive()) {
    const errorMessage = `Payment method ${methodId} not active`;
    throw new PaymentError(PaymentErrorCode.NOT_ACTIVE_METHOD, errorMessage);
  }

  return paymentMethod;
}

export function createRedirectInfo(
  methodId: string,
  payment: Payment,
  config: PaymentMethodConfig
): RedircetInfo {
  const paymentMethod = createPaymentMethod(methodId, config);
  const redirectInfo: RedircetInfo = {
    url: config.interfaceUrl,
    method: 'post',
    data: paymentMethod.createParams(payment)
  };
  return redirectInfo;
}
