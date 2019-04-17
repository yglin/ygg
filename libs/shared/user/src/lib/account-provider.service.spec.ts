import { TestBed } from '@angular/core/testing';

import { AccountProviderService } from './account-provider.service';

describe('AccountProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountProviderService = TestBed.get(AccountProviderService);
    expect(service).toBeTruthy();
  });
});
