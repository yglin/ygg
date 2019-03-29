import { async, TestBed } from '@angular/core/testing';
import { SharedUiWidgetsModule } from './shared-ui-widgets.module';

describe('SharedUiWidgetsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiWidgetsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUiWidgetsModule).toBeDefined();
  });
});
