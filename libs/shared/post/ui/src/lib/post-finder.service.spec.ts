import { TestBed } from '@angular/core/testing';

import { PostFinderService } from './post-finder.service';

describe('PostFinderService', () => {
  let service: PostFinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostFinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
