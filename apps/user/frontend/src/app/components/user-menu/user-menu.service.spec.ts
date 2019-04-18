import { TestBed } from '@angular/core/testing';

import { UserMenuService } from './user-menu.service';

describe('UserMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserMenuService = TestBed.get(UserMenuService);
    expect(service).toBeTruthy();
  });
});
