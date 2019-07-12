import { async, TestBed } from '@angular/core/testing';
import { PlaywhatPlayModule } from './playwhat-play.module';

describe('PlaywhatPlayModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PlaywhatPlayModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PlaywhatPlayModule).toBeDefined();
  });
});
