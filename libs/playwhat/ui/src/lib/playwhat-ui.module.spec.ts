import { async, TestBed } from '@angular/core/testing';
import { PlaywhatUiModule } from './playwhat-ui.module';

describe('PlaywhatUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PlaywhatUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PlaywhatUiModule).toBeDefined();
  });
});
