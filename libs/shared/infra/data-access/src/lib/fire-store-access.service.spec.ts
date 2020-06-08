import { TestBed } from '@angular/core/testing';

import { FireStoreAccessService } from './fire-store-access.service';

describe('FireStoreAccessService', () => {
  let service: FireStoreAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireStoreAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
