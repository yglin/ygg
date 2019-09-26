import { TestBed } from '@angular/core/testing';

import { TagsAdminService } from './tags-admin.service';

describe('TagAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TagsAdminService = TestBed.get(TagsAdminService);
    expect(service).toBeTruthy();
  });
});
