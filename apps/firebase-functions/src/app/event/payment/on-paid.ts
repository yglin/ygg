import { isEmpty, map, every } from 'lodash';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onPaymentPaid = functions.firestore
  .document('payments/{paymentId}')
  .onUpdate(onPaid);

async function onPaid(
  change: functions.Change<FirebaseFirestore.DocumentSnapshot>,
  context: functions.EventContext
) {
  const paymentId = context.params.paymentId;
  const prevValue = change.before.data();
  const newValue = change.after.data();
  if (!prevValue.isPaid && newValue.isPaid) {
    const snapshot = await admin.firestore().doc(`payments/${paymentId}`).get();
    const orderId = snapshot.get('orderId');
    if (orderId) {
      return checkOrderPaid(orderId);
    } else {
      return Promise.reject(new Error(`Payment not attached to any order`));
    }
  } else {
    return Promise.resolve();
  }
}

async function checkOrderPaid(orderId: string) {
  const isPaid = await isOrderPaid(orderId);
  if (isPaid) {
    console.log(`All of order ${orderId}'s payments are paid`);
    return await admin.firestore().doc(`orders/${orderId}`).update({
      isPaid: true,
      state: 2
    });
  } else {
    // Order is not paid, no update;
    return Promise.resolve(null);
  }
}

async function isOrderPaid(orderId: string): Promise<boolean> {
  const orderSnapShot = await admin.firestore().doc(`orders/${orderId}`).get();
  const order = orderSnapShot.data();
  if (!isEmpty(order.paymentIds)) {
    const isPaidArray = await Promise.all(
      map(order.paymentIds, paymentId => isPaymentPaid(paymentId))
    );
    return every(isPaidArray, isPaid => isPaid);
  } else {
    return Promise.reject(
      new Error(`Order ${orderId} has no payment attached`)
    );
  }
}

async function isPaymentPaid(paymentId: string): Promise<boolean> {
  const paymentSnapshot = await admin.firestore().doc(`payments/${paymentId}`).get();
  console.log(
    `Payment ${paymentId} is ${paymentSnapshot.get('isPaid') ? '' : 'not'} paid`
  );
  return paymentSnapshot.get('isPaid');
}
