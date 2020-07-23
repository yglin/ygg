import { TestBed } from '@angular/core/testing';

import { NotificationFactoryService } from './notification-factory.service';

describe('NotificationFactoryService', () => {
  let service: NotificationFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
