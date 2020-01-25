import { TestBed } from '@angular/core/testing';

import { TheThingImitationAccessService } from './the-thing-imitation-access.service';

describe('TheThingImitationAccessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TheThingImitationAccessService = TestBed.get(TheThingImitationAccessService);
    expect(service).toBeTruthy();
  });
});
