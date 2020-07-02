import { TestBed } from '@angular/core/testing';

import { EventFactoryService } from './event-factory.service';

describe('EventFactoryService', () => {
  let service: EventFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
