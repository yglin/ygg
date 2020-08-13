import * as functions from 'firebase-functions';
import { createOnWriteTrigger, clearTags } from './lib';
import * as env from "@ygg/env/environments.json";

export const onWritePlay = createOnWriteTrigger('plays', { region: env.firebase.region });
// export const onWriteSchedulePlan = createOnWriteTrigger('schedule-plans', { region: PROJECT_CONFIG.region });
export const scheduleHousecleanTags = functions.region(env.firebase.region as any).pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Taipei')
  .onRun((context: functions.EventContext) => {
    return clearTags();
  });
