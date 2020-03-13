import { TestBed } from '@angular/core/testing';

import { TheThingEditorService } from './the-thing-editor.service';

describe('TheThingEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TheThingEditorService = TestBed.get(TheThingEditorService);
    expect(service).toBeTruthy();
  });
});
