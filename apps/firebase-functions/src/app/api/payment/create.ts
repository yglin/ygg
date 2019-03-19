import * as express from 'express';
import * as admin from 'firebase-admin';

import { Payment, RedircetInfo } from '@ygg/shared/interfaces';
import * as ecpay from './ecpay';
import { HttpsError } from 'firebase-functions/lib/providers/https';

export async function create(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const payment = new Payment().fromData(req.body);
  let promiseRedirectInfo: Promise<RedircetInfo>;

  if (payment.methodId === 'ecpay') {
    promiseRedirectInfo = ecpay.createRedirectInfo(payment);
  } else {
    promiseRedirectInfo = Promise.resolve(null);
  }

  promiseRedirectInfo
    .then(redirectInfo => {
      const paymentCollection = admin.firestore().collection('payments');
      payment.redirectInfo = redirectInfo;
      return paymentCollection.doc(payment.id).set(payment.toData());
    })
    .then(() => {
      res.status(201).send(payment);
    })
    .catch(next);
}
