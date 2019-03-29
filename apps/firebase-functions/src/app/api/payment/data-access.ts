import * as admin from 'firebase-admin';
import { HttpError } from '../../error/http-error';
import * as HttpStatus from 'http-status-codes';
import { PaymentMethodConfig } from '@ygg/shopping/payment';

export async function getPayment(id: string): Promise<any> {
  // const database = admin.database();
  const firestore = admin.firestore();
  const paymentSnapshot = await firestore
    .collection('payments')
    .doc(id)
    .get();
  return paymentSnapshot.data();
}

export async function getMethodConfig(methodId: string): Promise<PaymentMethodConfig> {
  const configRefPath = `admin/payment/methods/${methodId}`;
  const configSnapShot = await admin.database().ref(configRefPath).once('value');
  if (!configSnapShot.exists()) {
    const errorMessage = `Not supported payment method: ${methodId}`;
    await Promise.reject(
      new HttpError(HttpStatus.BAD_REQUEST, errorMessage, methodId)
    );
  }
  return configSnapShot.val();
}

