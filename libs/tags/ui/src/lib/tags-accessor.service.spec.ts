import { TestBed } from '@angular/core/testing';

import { TagsAccessorService } from './tags-accessor.service';

describe('TagsAccessorService', () => {
  let service: TagsAccessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagsAccessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
