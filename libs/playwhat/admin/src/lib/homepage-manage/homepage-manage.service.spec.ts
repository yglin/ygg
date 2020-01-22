import { TestBed } from '@angular/core/testing';

import { HomepageManageService } from './homepage-manage.service';

describe('HomepageManageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HomepageManageService = TestBed.get(HomepageManageService);
    expect(service).toBeTruthy();
  });
});
