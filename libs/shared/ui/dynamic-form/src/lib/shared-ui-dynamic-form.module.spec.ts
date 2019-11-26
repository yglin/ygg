import { async, TestBed } from '@angular/core/testing';
import { SharedUiDynamicFormModule } from './shared-ui-dynamic-form.module';

describe('SharedUiDynamicFormModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiDynamicFormModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUiDynamicFormModule).toBeDefined();
  });
});
