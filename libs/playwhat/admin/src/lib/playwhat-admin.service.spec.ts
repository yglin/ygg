import { TestBed } from '@angular/core/testing';

import { PlaywhatAdminService } from './playwhat-admin.service';

describe('PlaywhatAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlaywhatAdminService = TestBed.get(PlaywhatAdminService);
    expect(service).toBeTruthy();
  });
});
