import { async, TestBed } from '@angular/core/testing';
import { PlaywhatTourModule } from './playwhat-tour.module';

describe('PlaywhatTourModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PlaywhatTourModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PlaywhatTourModule).toBeDefined();
  });
});
