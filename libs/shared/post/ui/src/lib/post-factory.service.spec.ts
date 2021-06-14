import { TestBed } from '@angular/core/testing';

import { PostFactoryService } from './post-factory.service';

describe('PostFactoryService', () => {
  let service: PostFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
