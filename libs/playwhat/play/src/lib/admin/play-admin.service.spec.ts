import { TestBed } from '@angular/core/testing';

import { PlayAdminService } from './Play-admin.service';

describe('PlayAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayAdminService = TestBed.get(PlayAdminService);
    expect(service).toBeTruthy();
  });
});
