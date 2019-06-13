import { TestBed } from '@angular/core/testing';

import { ScheduleService } from './schedule.service';
import { Schedule, Event } from './models';
import { of } from 'rxjs';
import { DataAccessService, CacheService } from '@ygg/shared/data-access';
import { EventService } from './event.service';

class MockDataAccessService {
  get$() {
    return of(new Schedule());
  }
}

class MockCacheService {
  has() { return true; }
  add() {}
  get() { return new Schedule();}
}

class MockEventService {
  fromResource() {return new Event()}
}


describe('ScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: DataAccessService, useClass: MockDataAccessService},
      {provide: CacheService, useClass: MockCacheService},
      {provide: EventService, useClass: MockEventService},
    ]
  }));

  it('should be created', () => {
    const service: ScheduleService = TestBed.get(ScheduleService);
    expect(service).toBeTruthy();
  });
});
