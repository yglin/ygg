import { TestBed } from '@angular/core/testing';

import { PlayFactoryService } from './play-factory.service';

describe('PlayFactoryService', () => {
  let service: PlayFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
