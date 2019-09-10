import { async, TestBed } from '@angular/core/testing';
import { PlaywhatTagModule } from './playwhat-tag.module';

describe('PlaywhatTagModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PlaywhatTagModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PlaywhatTagModule).toBeDefined();
  });
});
