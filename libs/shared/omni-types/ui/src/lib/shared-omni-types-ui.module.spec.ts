import { async, TestBed } from '@angular/core/testing';
import { SharedOmniTypesUiModule } from './shared-omni-types-ui.module';

describe('SharedOmniTypesUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedOmniTypesUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedOmniTypesUiModule).toBeDefined();
  });
});
