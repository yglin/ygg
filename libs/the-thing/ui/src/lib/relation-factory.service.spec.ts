import { TestBed } from '@angular/core/testing';

import { RelationFactoryService } from './relation-factory.service';

describe('RelationFactoryService', () => {
  let service: RelationFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelationFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
