import * as _ from 'lodash';
import * as moment from 'moment';
import * as admin from 'firebase-admin';
import * as express from 'express';
import { HttpError } from '../../error/http-error';
import * as HttpStatus from 'http-status-codes';
import { createPaymentMethod } from '@ygg/shopping/payment';
import { getMethodConfig, getPayment } from './data-access';

export async function checkPaid(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const methodId = req.params.method;
  const paymentResult = req.body;
  const config = await getMethodConfig(methodId);
  const paymentMethod = createPaymentMethod(methodId, config);
  // console.dir(paymentResult);
  const paymentId = paymentMethod.getPaymentId(paymentResult);
  const payment = await getPayment(paymentId);
  const errors = paymentMethod.checkPaid(payment, paymentResult);
  if (_.isEmpty(errors)) {
    await confirmPaid(payment, paymentResult);
    res
      .status(HttpStatus.OK)
      .send('1|OK')
      .end();
  } else {
    await failPayment(payment, paymentResult, errors);
  }
}

async function confirmPaid(payment: any, paymentResult: any) {
  const firestore = admin.firestore();
  console.log(`Payment ${payment.id} is successfully paid`);
  if (!payment.logs) {
    payment.logs = [];
  }
  payment.logs.push({
    timestamp: moment().format(),
    type: 'success',
    data: JSON.stringify(paymentResult)
  });
  const paymentDoc = firestore.collection('payments').doc(payment.id);
  await paymentDoc.update({
    isPaid: true,
    paidDate: moment().format(),
    logs: payment.logs
  });
}

async function failPayment(
  payment: any,
  paymentResult: any,
  errors: Error[] = []
) {
  const firestore = admin.firestore();
  const errorReasons = _.join(errors, '\n');
  const errorMessage = `Check paid failed,\n method = "${
    payment.method
  }",\n payment ID = ${payment.id}, reasons:\n${errorReasons}`;
  console.error(errorMessage);

  if (!payment.logs) {
    payment.logs = [];
  }
  const log = {
    timestamp: moment().format(),
    type: 'fail',
    data: JSON.stringify(paymentResult),
    errors: JSON.stringify(errors)
  };
  payment.logs.push(log);

  const paymentDoc = firestore.collection('payments').doc(payment.id);
  await paymentDoc.update({
    isPaid: payment.isPaid || false,
    logs: payment.logs
  });
  await Promise.reject(
    new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, errorMessage, {
      method: 'ecpay',
      paymentResult: paymentResult
    })
  );
}
