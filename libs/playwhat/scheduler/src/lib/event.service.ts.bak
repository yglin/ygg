import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { Resource } from '@ygg/playwhat/resource';
import { Event } from './models/event';
import { Observable, of } from 'rxjs';
import { CacheService, DataAccessService } from '@ygg/shared/infra/data-access';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  collection = 'events';

  constructor(
    private dataAccessService: DataAccessService,
    private cacheService: CacheService
  ) { }

  create(): Event {
    const newEvent = new Event();
    this.cacheService.add(newEvent);
    return newEvent;
  }

  fromResource(resource: Resource): Event {
    const event = this.create();
    event.name = resource.name;
    event.description = resource.description;
    event.color = resource.color;
    event.album = resource.album;
    event.resourceId = resource.id;
    event.start = moment().add(1, 'month').toDate();
    event.end = moment(event.start).add(resource.timeLength * 30, 'minute').toDate();
    return event;
  }

  get$(id: string): Observable<Event> {
    if (this.cacheService.has(id)) {
      return of(this.cacheService.get(id));
    } else {
      return this.dataAccessService.get$(this.collection, id, Event);
    }
  }

  /**
   * Swap 2 events' start times, but keep their original time span length.
   * This function modifies both input events
   */
  swapEventsTime(eventA: Event, eventB: Event) {
    const timeLengthA = moment(eventA.end).diff(eventA.start, 'minute');
    const startA = new Date(eventA.start.getTime());
    eventA.start = new Date(eventB.start.getTime());
    eventA.end = moment(eventA.start).add(timeLengthA, 'minute').toDate();
    const timeLengthB = moment(eventB.end).diff(eventB.start, 'minute');
    eventB.start = new Date(startA.getTime());
    eventB.end = moment(eventB.start).add(timeLengthB, 'minute').toDate();
  }
}
