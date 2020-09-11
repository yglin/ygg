import { TestBed } from '@angular/core/testing';

import { CustomPageAccessService } from './custom-page-access.service';

describe('CustomPageAccessService', () => {
  let service: CustomPageAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomPageAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
