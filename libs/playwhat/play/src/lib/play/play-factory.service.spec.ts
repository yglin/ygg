import { TestBed } from '@angular/core/testing';

import { PlayFactoryService } from './play-factory.service';

describe('PlayFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayFactoryService = TestBed.get(PlayFactoryService);
    expect(service).toBeTruthy();
  });
});
