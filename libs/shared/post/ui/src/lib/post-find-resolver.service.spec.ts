import { TestBed } from '@angular/core/testing';

import { PostFindResolverService } from './post-find-resolver.service';

describe('PostFindResolverService', () => {
  let service: PostFindResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostFindResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
