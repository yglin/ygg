import { TestBed } from '@angular/core/testing';

import { TagsFactoryService } from './tags-factory.service';

describe('TagsFactoryService', () => {
  let service: TagsFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagsFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
