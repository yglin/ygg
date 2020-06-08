import { TestBed } from '@angular/core/testing';

import { InvitationAccessService } from './invitation-access.service';

describe('InvitationAccessService', () => {
  let service: InvitationAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvitationAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
