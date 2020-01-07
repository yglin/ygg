import { TestBed } from '@angular/core/testing';

import { PageStashService } from './page-stash.service';

describe('PageStashService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageStashService = TestBed.get(PageStashService);
    expect(service).toBeTruthy();
  });
});
