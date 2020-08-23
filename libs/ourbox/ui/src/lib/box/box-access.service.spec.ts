import { TestBed } from '@angular/core/testing';

import { BoxAccessService } from './box-access.service';

describe('BoxAccessService', () => {
  let service: BoxAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoxAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
