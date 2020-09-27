import { TestBed } from '@angular/core/testing';

import { TheThingSourceService } from './the-thing-source.service';

describe('TheThingSourceService', () => {
  let service: TheThingSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheThingSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
