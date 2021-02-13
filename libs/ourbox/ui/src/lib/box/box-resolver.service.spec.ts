import { TestBed } from '@angular/core/testing';

import { BoxResolverService } from './box-resolver.service';

describe('BoxResolverService', () => {
  let service: BoxResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoxResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
