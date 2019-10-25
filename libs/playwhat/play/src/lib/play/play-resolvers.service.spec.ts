import { TestBed } from '@angular/core/testing';

import { PlayResolversService } from './play-resolvers.service';

describe('PlayResolversService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayResolversService = TestBed.get(PlayResolversService);
    expect(service).toBeTruthy();
  });
});
