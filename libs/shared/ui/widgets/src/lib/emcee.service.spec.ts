import { TestBed } from '@angular/core/testing';

import { EmceeService } from './emcee.service';

describe('EmceeService', () => {
  let service: EmceeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmceeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
