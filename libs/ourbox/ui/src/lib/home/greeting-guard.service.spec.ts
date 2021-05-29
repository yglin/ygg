import { TestBed } from '@angular/core/testing';

import { GreetingGuardService } from './greeting-guard.service';

describe('GreetingGuardService', () => {
  let service: GreetingGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GreetingGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
