import { TestBed } from '@angular/core/testing';

import { TheThingFactoryService } from './the-thing-factory.service';

describe('TheThingFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TheThingFactoryService = TestBed.get(TheThingFactoryService);
    expect(service).toBeTruthy();
  });
});
