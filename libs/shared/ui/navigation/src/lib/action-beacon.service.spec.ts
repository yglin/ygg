import { TestBed } from '@angular/core/testing';

import { ActionBeaconService } from './action-beacon.service';

describe('ActionBeaconService', () => {
  let service: ActionBeaconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionBeaconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
