import { async, TestBed } from '@angular/core/testing';
import { SharedUiNgMaterialModule } from './shared-ui-ng-material.module';

describe('SharedUiNgMaterialModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiNgMaterialModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUiNgMaterialModule).toBeDefined();
  });
});
