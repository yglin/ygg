import { isEmpty, join } from 'lodash';
import * as admin from 'firebase-admin';
import { RedircetInfo, Payment } from '@ygg/shared/interfaces';
import { EcpayOrder, EcpayConfig } from '@ygg/shared/utils/ecpay';
import { HttpError } from '../../error/http-error';
import * as HttpStatus from 'http-status-codes';

function getConfig(): Promise<EcpayConfig> {
  const configRefPath = 'admin/payments/ecpay';
  const ecpayConfigRef = admin.database().ref(configRefPath);
  return ecpayConfigRef
    .once('value')
    .then(snapshot => snapshot.val())
    .then(configData => {
      if (isEmpty(configData)) {
        const errorMessage = `Can not fetch ecpay config data from firebase database, path = ${configRefPath}`;
        const httpError = new HttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          errorMessage,
          configData
        );
        return Promise.reject(httpError);
      } else {
        return Promise.resolve(configData);
      }
    });
}

export function createRedirectInfo(payment: Payment): Promise<RedircetInfo> {
  return getConfig().then(ecpayConfig => {
    const ecpayOrder = new EcpayOrder(ecpayConfig).fromPayment(payment);
    const errors = ecpayOrder.getErrors();
    if (!isEmpty(errors)) {
      const errorMessage = join(errors.map(error => error.message), '<br>');
      const httpError = new HttpError(
        HttpStatus.BAD_REQUEST,
        errorMessage,
        errors
      );
      return Promise.reject(httpError);
    } else {
      const redirectInfo: RedircetInfo = {
        url: ecpayConfig.interfaceUrl,
        method: 'post',
        data: ecpayOrder.toParams()
      };
      return Promise.resolve(redirectInfo);
    }
  });
}
