import { async, TestBed } from '@angular/core/testing';
import { SharedGeographyUiModule } from './shared-geography-ui.module';

describe('SharedGeographyUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedGeographyUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedGeographyUiModule).toBeDefined();
  });
});
