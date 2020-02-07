import { TestBed } from '@angular/core/testing';

import { TheThingViewsService } from './the-thing-views.service';

describe('TheThingViewsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TheThingViewsService = TestBed.get(TheThingViewsService);
    expect(service).toBeTruthy();
  });
});
