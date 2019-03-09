import { async, TestBed } from '@angular/core/testing';
import { SharedFormControlsModule } from './shared-form-controls.module';

describe('SharedFormControlsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedFormControlsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedFormControlsModule).toBeDefined();
  });
});
