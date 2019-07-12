import { TestBed } from '@angular/core/testing';

import { ResourceTagService } from './resource-tag.service';

describe('ResourceTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResourceTagService = TestBed.get(ResourceTagService);
    expect(service).toBeTruthy();
  });
});
