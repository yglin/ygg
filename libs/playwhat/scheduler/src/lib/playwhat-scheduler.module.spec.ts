import { async, TestBed } from '@angular/core/testing';
import { PlaywhatSchedulerModule } from './playwhat-scheduler.module';

describe('PlaywhatSchedulerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PlaywhatSchedulerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PlaywhatSchedulerModule).toBeDefined();
  });
});
