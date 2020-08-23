import { TestBed } from '@angular/core/testing';

import { ItemAccessService } from './item-access.service';

describe('ItemAccessService', () => {
  let service: ItemAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
