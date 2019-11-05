import { TestBed } from '@angular/core/testing';

import { EventService } from './event.service';
import { of } from 'rxjs';
import { Event } from './models';
import { DataAccessService, CacheService } from '@ygg/shared/infra/data-access';

class MockDataAccessService {
  get$() {
    return of(new Event());
  }
}

class MockCacheService {
  has() { return true; }
  add() {}
  get() { return new Event();}
}


describe('EventService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: DataAccessService, useClass: MockDataAccessService },
      { provide: CacheService, useClass: MockCacheService },
    ]
  }));

  it('should be created', () => {
    const service: EventService = TestBed.get(EventService);
    expect(service).toBeTruthy();
  });
});
