import { TestBed } from '@angular/core/testing';

import { TagsFinderService } from './tags-finder.service';

describe('TagsFinderService', () => {
  let service: TagsFinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagsFinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
