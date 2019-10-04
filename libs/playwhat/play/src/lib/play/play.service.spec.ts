import { TestBed } from '@angular/core/testing';

import { PlayService } from './play.service';
import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';

describe('PlayService', () => {
  @Injectable()
  class MockDataAccessService {}

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: DataAccessService, useClass: MockDataAccessService }
      ]
    })
  );

  it('should be created', () => {
    const service: PlayService = TestBed.get(PlayService);
    expect(service).toBeTruthy();
  });
});
