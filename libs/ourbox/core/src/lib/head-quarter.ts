import { wrapError } from '@ygg/shared/infra/error';
import { get, has, set, isArray } from 'lodash';
import { isObservable, Subject, Subscription } from 'rxjs';

export class OurboxHeadQuarter {
  beacons: any = {};
  subscription = new Subscription();

  constructor() {}

  onDestroy() {
    this.subscription.unsubscribe();
  }

  subscribe(
    eventName: string,
    callback: (...args: any[]) => any
  ): Subscription {
    try {
      if (!has(this.beacons, eventName)) {
        set(this.beacons, eventName, new Subject());
      }
      const subject: Subject<any> = get(this.beacons, eventName);
      const subscription = subject.subscribe(callback);
      this.subscription.add(subscription);
      return subscription;
    } catch (error) {
      const wrpError = wrapError(
        error,
        `Failed to subscribe callback for event "${eventName}"`
      );
      throw wrpError;
    }
  }

  emit(eventName: string, data: any) {
    if (has(this.beacons, eventName)) {
      const beacon = get(this.beacons, eventName);
      if (beacon) {
        beacon.next(data);
      }
    }
  }
}
