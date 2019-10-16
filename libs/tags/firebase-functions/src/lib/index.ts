import { createOnWriteTrigger } from './on-write-taggable';

export const onWritePlay = createOnWriteTrigger('plays');
export const onWriteScheduleForm = createOnWriteTrigger('schedule-forms');
