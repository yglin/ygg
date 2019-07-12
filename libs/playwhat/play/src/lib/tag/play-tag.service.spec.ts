import { TestBed } from '@angular/core/testing';

import { PlayTagService } from './play-tag.service';

describe('PlayTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlayTagService = TestBed.get(PlayTagService);
    expect(service).toBeTruthy();
  });
});
