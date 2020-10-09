import { TestBed } from '@angular/core/testing';

import { TagsStoryService } from './tags-story.service';

describe('TagsStoryService', () => {
  let service: TagsStoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagsStoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
