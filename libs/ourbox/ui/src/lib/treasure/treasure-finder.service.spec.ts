import { TestBed } from '@angular/core/testing';

import { TreasureFinderService } from './treasure-finder.service';

describe('TreasureFinderService', () => {
  let service: TreasureFinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreasureFinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
