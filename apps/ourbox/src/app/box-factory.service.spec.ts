import { TestBed } from '@angular/core/testing';

import { BoxFactoryService } from './box-factory.service';

describe('BoxFactoryService', () => {
  let service: BoxFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoxFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
