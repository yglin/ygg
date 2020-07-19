import { TestBed } from '@angular/core/testing';

import { CommentFactoryService } from './comment-factory.service';

describe('CommentFactoryService', () => {
  let service: CommentFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
