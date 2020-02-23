import { TestBed } from '@angular/core/testing';

import { TheThingBuilderService } from './the-thing-builder.service';

describe('TheThingBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TheThingBuilderService = TestBed.get(TheThingBuilderService);
    expect(service).toBeTruthy();
  });
});
