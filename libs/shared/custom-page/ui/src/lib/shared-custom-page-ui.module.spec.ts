import { async, TestBed } from '@angular/core/testing';
import { SharedCustomPageUiModule } from './shared-custom-page-ui.module';

describe('SharedCustomPageUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedCustomPageUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCustomPageUiModule).toBeDefined();
  });
});
