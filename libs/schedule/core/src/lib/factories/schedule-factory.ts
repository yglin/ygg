import {
  Schedule,
  ServiceEvent,
  Service,
  ServiceAvailablility
} from '../models';
import { Subject, Observable, Subscription, merge } from 'rxjs';
import { filter, take, tap, map } from 'rxjs/operators';
import { Router, Emcee } from '@ygg/shared/infra/core';
import { BusinessHours } from '@ygg/shared/omni-types/core';

export abstract class ScheduleFactory {
  onSave$: Subject<Schedule> = new Subject();
  onCancel$: Subject<Schedule> = new Subject();
  schedulePool: { [id: string]: Schedule } = {};
  serviceAvailabilities$: {
    [serviceId: string]: Observable<ServiceAvailablility>;
  } = {};
  serviceAvailabilities: {
    [serviceId: string]: ServiceAvailablility;
  } = {};
  subscription: Subscription = new Subscription();

  constructor(protected router: Router, protected emcee: Emcee) {}

  async edit(schedule: Schedule): Promise<Schedule | string> {
    this.schedulePool[schedule.id] = schedule;
    // console.log(`Edit schedule ${schedule.id}`);
    for (const serviceId in schedule.serviceAvailabilities$) {
      if (
        Object.prototype.hasOwnProperty.call(
          schedule.serviceAvailabilities$,
          serviceId
        )
      ) {
        this.serviceAvailabilities$[serviceId] =
          schedule.serviceAvailabilities$[serviceId];
        this.subscription.add(
          this.serviceAvailabilities$[serviceId].subscribe(
            serviceAvailability => {
              this.serviceAvailabilities[serviceId] = serviceAvailability;
            }
          )
        );
      }
    }
    this.router.navigate(['/', 'schedule', schedule.id]);
    return new Promise((resolve, reject) => {
      merge(
        this.onSave$.pipe(
          // tap(_schedule => console.log(_schedule)),
          filter(_schedule => _schedule.id === schedule.id),
          take(1)
        ),
        this.onCancel$.pipe(
          filter(_schedule => _schedule.id === schedule.id),
          take(1),
          map(() => 'cancel')
        )
      ).subscribe(
        result => resolve(result),
        error => reject(error)
      );
    });
  }

  async submit(schedule: Schedule) {
    const confirm = await this.emcee.confirm(
      '<h3>行程安排完成，送出此行程表？</h3>'
    );
    if (confirm) {
      this.onSave$.next(schedule);
    }
  }

  async cancel(schedule: Schedule) {
    const confirm = await this.emcee.confirm('<h3>取消行程安排？</h3>');
    if (confirm) {
      this.onCancel$.next(schedule);
    }
  }

  getServiceAvailability(serviceId: string): ServiceAvailablility {
    return serviceId in this.serviceAvailabilities
      ? this.serviceAvailabilities[serviceId]
      : null;
  }

  async assessEvent(event: ServiceEvent): Promise<Error[]> {
    const errors: Error[] = [];
    const service: Service = event.service;
    // Check business hours
    if (
      BusinessHours.isBusinessHours(service.businessHours) &&
      !service.businessHours.include(event.timeRange)
    ) {
      errors.push(new Error(`不在${BusinessHours.label}範圍內`));
    } else {
      const sa = this.getServiceAvailability(event.service.id);
      if (sa) {
        const minAvailability: number = sa.getMinAvailability(event.timeRange);
        if (event.numParticipants > minAvailability) {
          errors.push(
            new Error(
              `參加人數${event.numParticipants}已超過該時段的最低容量${minAvailability}`
            )
          );
        }
      }
    }
    return errors;
  }
}
