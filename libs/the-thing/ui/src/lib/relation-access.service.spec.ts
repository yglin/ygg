import { TestBed } from '@angular/core/testing';

import { RelationAccessService } from './relation-access.service';

describe('RelationAccessService', () => {
  let service: RelationAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelationAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
