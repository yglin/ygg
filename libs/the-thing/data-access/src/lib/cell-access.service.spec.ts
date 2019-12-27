import { TestBed } from '@angular/core/testing';

import { CellAccessService } from './cell-access.service';

describe('CellAccessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CellAccessService = TestBed.get(CellAccessService);
    expect(service).toBeTruthy();
  });
});
