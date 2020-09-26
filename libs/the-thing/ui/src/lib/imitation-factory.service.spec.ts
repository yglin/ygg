import { TestBed } from '@angular/core/testing';

import { ImitationFactoryService } from './imitation-factory.service';

describe('ImitationFactoryService', () => {
  let service: ImitationFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImitationFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
