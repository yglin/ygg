// import { join, isEmpty } from 'lodash';
import * as express from 'express';
import * as admin from 'firebase-admin';

import { Payment } from '@ygg/shared/interfaces';
import { getMethodConfig } from './data-access';
import { createRedirectInfo } from '@ygg/shopping/payment';

export async function create(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const payment = new Payment().fromData(req.body);
  const config = await getMethodConfig(payment.methodId);
  const redirectInfo = createRedirectInfo(payment.methodId, payment, config);
  payment.redirectInfo = redirectInfo;
  const paymentCollection = admin.firestore().collection('payments');
  await paymentCollection.doc(payment.id).set(payment.toData());
  res.status(201).send(payment);
}

