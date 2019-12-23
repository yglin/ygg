import { TestBed } from '@angular/core/testing';

import { AdditionFactoryService } from './addition-factory.service';

describe('AdditionFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdditionFactoryService = TestBed.get(AdditionFactoryService);
    expect(service).toBeTruthy();
  });
});
