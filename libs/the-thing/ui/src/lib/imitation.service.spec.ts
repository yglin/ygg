import { TestBed } from '@angular/core/testing';

import { ImitationService } from './imitation.service';

describe('ImitationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImitationService = TestBed.get(ImitationService);
    expect(service).toBeTruthy();
  });
});
