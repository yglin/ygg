import { async, TestBed } from '@angular/core/testing';
import { SharedTagsUiModule } from './shared-tags-ui.module';

describe('SharedTagsUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedTagsUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedTagsUiModule).toBeDefined();
  });
});
