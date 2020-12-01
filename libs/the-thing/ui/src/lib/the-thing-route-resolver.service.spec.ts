import { TestBed } from '@angular/core/testing';

import { TheThingRouteResolverService } from './the-thing-route-resolver.service';

describe('TheThingRouteResolverService', () => {
  let service: TheThingRouteResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheThingRouteResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
