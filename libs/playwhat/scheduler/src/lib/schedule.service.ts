import {Injectable} from '@angular/core';
import {CacheService, DataAccessService} from '@ygg/shared/infra/data-access';
import {Resource} from '@ygg/playwhat/resource';
import {shuffle} from 'lodash';
import * as moment from 'moment';
import {interval, Observable, of} from 'rxjs';
import {map, take} from 'rxjs/operators';

import {EventService} from './event.service';
import {Schedule} from './models';
import {SchedulePlan} from './schedule-plan';
import {Event} from './models/event';

@Injectable({providedIn: 'root'})
export class ScheduleService {
  collection: 'schedules';

  constructor(
      private dataAccessService: DataAccessService,
      private cacheService: CacheService, private eventService: EventService) {}

  create(): Schedule {
    const newSchedule = new Schedule();
    this.cacheService.add(newSchedule);
    return newSchedule;
  }

  get$(id: string): Observable<Schedule> {
    if (this.cacheService.has(id)) {
      return of(this.cacheService.get(id));
    } else {
      return this.dataAccessService.get$(this.collection, id, Schedule);
    }
  }

  changeResources(schedule: Schedule, resourceIds: string[] = []):
      Observable<Schedule> {
    return of(schedule);
  }

  rearrangeKeepOrder(schedule: Schedule) {
    let scheduleStart = moment().add(999, 'year');
    for (const event of schedule.events) {
      const eventStart = moment(event.start);
      if (scheduleStart.isAfter(eventStart)) {
        scheduleStart = eventStart;
      }
    }
    
    const timeProbe = moment(scheduleStart);
    for (const event of schedule.events) {
      const originalTimeLength = moment(event.end).diff(moment(event.start), 'minute');
      event.start = moment(timeProbe).toDate();
      timeProbe.add(originalTimeLength, 'minute');
      event.end = moment(timeProbe).toDate();
      timeProbe.add(1, 'hour');
    }
  }

  autoSchedule(resources: Resource[], form: SchedulePlan):
      Observable<Schedule> {
    // TODO implement in real
    const maxOutputsCount = 3;
    const resultSchedules = [];
    for (let count = 0; count < maxOutputsCount; count++) {
      const resultSchedule = this.create();
      let index = 0;
      const shuffledResources = shuffle(resources);
      for (const timeItr = moment(form.dateRange.start);
           timeItr.isBefore(moment(form.dateRange.end)) &&
           index < shuffledResources.length;
           timeItr.add(30, 'minute')) {
        const resource = shuffledResources[index];
        const event = this.eventService.fromResource(resource);
        // console.log(event);
        if (event) {
          const diff = moment(event.end).diff(moment(event.start), 'minute');
          event.start = moment(timeItr).toDate();
          timeItr.add(diff, 'minute');
          event.end = moment(timeItr).toDate();
          resultSchedule.events.push(event);
          timeItr.add(1, 'hour').startOf('hour');
        }
        index += 1;
      }
      resultSchedules.push(resultSchedule);
    }

    return interval(1000).pipe(
        take(maxOutputsCount), map(i => resultSchedules[i]));
  }
}
