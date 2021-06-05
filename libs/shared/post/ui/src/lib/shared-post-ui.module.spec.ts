import { async, TestBed } from '@angular/core/testing';
import { SharedPostUiModule } from './shared-post-ui.module';

describe('SharedPostUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedPostUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedPostUiModule).toBeDefined();
  });
});
