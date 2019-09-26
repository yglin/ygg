import { async, TestBed } from '@angular/core/testing';
import { TagsUiModule } from './tags-ui.module';

describe('TagsUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TagsUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TagsUiModule).toBeDefined();
  });
});
