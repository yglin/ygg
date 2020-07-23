import { EntityAccessor } from '@ygg/shared/infra/core';
import { Notification } from './notification';

export class NotificationAccessor extends EntityAccessor<Notification> {
  collection = Notification.collection;
  serializer = Notification.serializer;
  deserializer = Notification.deserializer;
}
