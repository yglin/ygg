import { TestBed } from '@angular/core/testing';

import { TreasureFactoryService } from './treasure-factory.service';

describe('TreasureFactoryService', () => {
  let service: TreasureFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreasureFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
