import { TestBed } from '@angular/core/testing';

import { ImitationResolverService } from './imitation-resolver.service';

describe('ImitationResolverService', () => {
  let service: ImitationResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImitationResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
