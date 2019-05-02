import { async, TestBed } from '@angular/core/testing';
import { SharedUiThemesModule } from './shared-ui-themes.module';

describe('SharedUiThemesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiThemesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUiThemesModule).toBeDefined();
  });
});
