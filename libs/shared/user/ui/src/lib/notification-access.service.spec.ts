import { TestBed } from '@angular/core/testing';

import { NotificationAccessService } from './notification-access.service';

describe('NotificationAccessService', () => {
  let service: NotificationAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
