import { createOnWriteTrigger } from './on-write-taggable';

export const onWritePlay = createOnWriteTrigger('plays');
export const onWriteSchedulePlan = createOnWriteTrigger('schedule-plans');
