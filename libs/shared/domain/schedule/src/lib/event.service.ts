import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { Resource } from '@ygg/shared/domain/resource';
import { Event } from './models/event';
import { Observable, of } from 'rxjs';
import { CacheService, DataAccessService } from '@ygg/shared/data-access';

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
}
