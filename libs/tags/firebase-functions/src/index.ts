import * as functions from 'firebase-functions';
import { createOnWriteTrigger, clearTags } from './lib';
import * as PROJECT_CONFIG from "@ygg/firebase/project-config.json";

export const onWritePlay = createOnWriteTrigger('plays', { region: PROJECT_CONFIG.region });
// export const onWriteSchedulePlan = createOnWriteTrigger('schedule-plans', { region: PROJECT_CONFIG.region });
export const scheduleHousecleanTags = functions.region(PROJECT_CONFIG.region as any).pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Taipei')
  .onRun((context: functions.EventContext) => {
    return clearTags();
  });
