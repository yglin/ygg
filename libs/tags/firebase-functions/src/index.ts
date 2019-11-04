import * as functions from 'firebase-functions';
import { createOnWriteTrigger, clearTags } from './lib';

export const onWritePlay = createOnWriteTrigger('plays');
export const onWriteSchedulePlan = createOnWriteTrigger('schedule-plans');
export const scheduleHousecleanTags = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Taipei')
  .onRun((context: functions.EventContext) => {
    clearTags();
  });
