import { TestBed } from '@angular/core/testing';

import { PageResolverService } from './page-resolver.service';

describe('PageResolverService', () => {
  let service: PageResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
