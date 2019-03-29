import { TestBed } from '@angular/core/testing';

import { ProgressSpinnerService } from './progress-spinner.service';

describe('ProgressSpinnerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgressSpinnerService = TestBed.get(ProgressSpinnerService);
    expect(service).toBeTruthy();
  });
});
