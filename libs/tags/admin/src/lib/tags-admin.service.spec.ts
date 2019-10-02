import { TestBed } from '@angular/core/testing';

import { TagsAdminService } from './tags-admin.service';
import { Injectable } from '@angular/core';
import { TagsService } from '@ygg/tags/data-access';

describe('TagAdminService', () => {
  @Injectable()
  class MockTagsService {
    async saveUserOptionTags() {};
  }

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: TagsService, useClass: MockTagsService }
    ]
  }));

  it('should be created', () => {
    const service: TagsAdminService = TestBed.get(TagsAdminService);
    expect(service).toBeTruthy();
  });
});
