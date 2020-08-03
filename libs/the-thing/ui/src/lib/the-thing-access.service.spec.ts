import { TestBed } from '@angular/core/testing';

import { TheThingAccessService } from './the-thing-access.service';

describe('TheThingAccessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TheThingAccessService = TestBed.get(TheThingAccessService);
    expect(service).toBeTruthy();
  });
});
