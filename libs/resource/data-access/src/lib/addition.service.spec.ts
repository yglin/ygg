import { TestBed } from '@angular/core/testing';

import { AdditionService } from './addition.service';

describe('AdditionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdditionService = TestBed.get(AdditionService);
    expect(service).toBeTruthy();
  });
});
