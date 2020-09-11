import { TestBed } from '@angular/core/testing';

import { CustomPageFactoryService } from './custom-page-factory.service';

describe('CustomPageFactoryService', () => {
  let service: CustomPageFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomPageFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
