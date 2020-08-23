import { TestBed } from '@angular/core/testing';

import { ItemTransferFactoryService } from './item-transfer-factory.service';

describe('ItemTransferFactoryService', () => {
  let service: ItemTransferFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemTransferFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
