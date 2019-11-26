import { async, TestBed } from '@angular/core/testing';
import { ResourceUiModule } from './resource-ui.module';

describe('ResourceUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ResourceUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ResourceUiModule).toBeDefined();
  });
});
