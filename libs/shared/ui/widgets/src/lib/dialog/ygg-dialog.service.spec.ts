import { TestBed } from '@angular/core/testing';

import { YggDialogService } from './ygg-dialog.service';

describe('YggDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YggDialogService = TestBed.get(YggDialogService);
    expect(service).toBeTruthy();
  });
});
