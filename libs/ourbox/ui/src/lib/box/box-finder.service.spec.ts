import { TestBed } from '@angular/core/testing';

import { BoxFinderService } from './box-finder.service';

describe('BoxFinderService', () => {
  let service: BoxFinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoxFinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
