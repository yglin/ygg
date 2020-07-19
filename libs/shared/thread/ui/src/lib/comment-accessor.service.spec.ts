import { TestBed } from '@angular/core/testing';

import { CommentAccessorService } from './comment-accessor.service';

describe('CommentAccessorService', () => {
  let service: CommentAccessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentAccessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
