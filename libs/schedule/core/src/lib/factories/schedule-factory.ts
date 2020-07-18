import { Schedule, ServiceEvent, Service } from '../models';
import { Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Router, Emcee } from '@ygg/shared/infra/core';
import { BusinessHours } from '@ygg/shared/omni-types/core';

export abstract class ScheduleFactory {
  onSave$: Subject<Schedule> = new Subject();
  schedulePool: { [id: string]: Schedule } = {};

  constructor(protected router: Router, protected emcee: Emcee) {}

  async edit(schedule: Schedule): Promise<Schedule> {
    this.schedulePool[schedule.id] = schedule;
    console.log(`Edit schedule ${schedule.id}`);
    this.router.navigate(['/', 'schedule', schedule.id]);
    return this.onSave$
      .pipe(
        filter(_schedule => _schedule.id === schedule.id),
        take(1)
      )
      .toPromise();
  }

  async submit(schedule: Schedule) {
    const confirm = await this.emcee.confirm('行程安排完成，送出此行程表？');
    if (confirm) {
      this.onSave$.next(schedule);
    }
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
    }
    return errors;
  }
}
