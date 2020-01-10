import { TestBed } from '@angular/core/testing';

import { TheThingResolver } from './the-thing-resolver.service';

describe('TheThingResolver', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TheThingResolver = TestBed.get(TheThingResolver);
    expect(service).toBeTruthy();
  });
});
