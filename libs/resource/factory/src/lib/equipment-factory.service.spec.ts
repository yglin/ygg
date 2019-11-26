import { TestBed } from '@angular/core/testing';

import { EquipmentFactoryService } from './equipment-factory.service';

describe('EquipmentFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EquipmentFactoryService = TestBed.get(EquipmentFactoryService);
    expect(service).toBeTruthy();
  });
});
