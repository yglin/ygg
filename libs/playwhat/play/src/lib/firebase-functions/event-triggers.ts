import { isEmpty } from 'lodash';
import * as functions from 'firebase-functions';
import { FirebaseFunctions } from "@ygg/playwhat/tag";

export const EventTriggers: any = {};

type OnWriteFunction = (beforeData: any, afterData: any, context: functions.EventContext) => Promise<void>;

const onWriteFunctions: OnWriteFunction[] = [
  FirebaseFunctions.onWriteTaggable
];

if (!isEmpty(onWriteFunctions)) {
  EventTriggers.onWrite = functions.firestore.document(`plays/{id}`).onWrite(
    async (
      change: functions.Change<FirebaseFirestore.DocumentSnapshot>,
      context: functions.EventContext
    ) => {
      const beforeData: any = change.before.exists ? change.before.data() : null;
      const afterData: any = change.after.exists ? change.after.data() : null;
      context.params.collection = 'plays';
      for (const onWriteFunction of onWriteFunctions) {
        await onWriteFunction(beforeData, afterData, context);
      }
      return Promise.resolve();
    }
  )  
}
