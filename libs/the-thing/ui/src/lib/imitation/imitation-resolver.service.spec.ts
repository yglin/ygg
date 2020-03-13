import { TestBed } from '@angular/core/testing';

import { ImitationResolver } from './imitation-resolver.service';

describe('ImitationResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImitationResolver = TestBed.get(ImitationResolver);
    expect(service).toBeTruthy();
  });
});
