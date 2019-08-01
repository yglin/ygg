import { TestBed, inject } from '@angular/core/testing';

import { FireStorageService } from './fire-storage.service';

describe('FireStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FireStorageService]
    });
  });

  it('should be created', inject([FireStorageService], (service: FireStorageService) => {
    expect(service).toBeTruthy();
  }));
});
