import { getEnv } from '@ygg/shared/infra/core';
import * as functions from 'firebase-functions';
import { createOnWriteTrigger, clearTags } from './lib';

const firebaseConfig = getEnv('firebase');
export const onWritePlay = createOnWriteTrigger('plays', {
  region: firebaseConfig.region
});
// export const onWriteSchedulePlan = createOnWriteTrigger('schedule-plans', { region: PROJECT_CONFIG.region });
export const scheduleHousecleanTags = functions
  .region(firebaseConfig.region as any)
  .pubsub.schedule('0 0 * * *')
  .timeZone('Asia/Taipei')
  .onRun((context: functions.EventContext) => {
    return clearTags();
  });
