import { TestBed } from '@angular/core/testing';

import { ResourceAdminService } from './resource-admin.service';

describe('ResourceAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResourceAdminService = TestBed.get(ResourceAdminService);
    expect(service).toBeTruthy();
  });
});
