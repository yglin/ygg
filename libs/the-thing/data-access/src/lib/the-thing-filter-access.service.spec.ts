import { TestBed } from '@angular/core/testing';

import { TheThingFilterAccessService } from './the-thing-filter-access.service';

describe('TheThingFilterAccessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TheThingFilterAccessService = TestBed.get(TheThingFilterAccessService);
    expect(service).toBeTruthy();
  });
});
