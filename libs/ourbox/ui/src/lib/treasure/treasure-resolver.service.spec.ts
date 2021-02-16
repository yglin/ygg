import { TestBed } from '@angular/core/testing';

import { TreasureResolverService } from './treasure-resolver.service';

describe('TreasureResolverService', () => {
  let service: TreasureResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreasureResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
