import { TestBed } from '@angular/core/testing';

import { TheThingResolverService } from './the-thing-resolver.service';

describe('TheThingResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TheThingResolverService = TestBed.get(TheThingResolverService);
    expect(service).toBeTruthy();
  });
});
