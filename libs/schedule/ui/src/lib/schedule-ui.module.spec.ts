import { async, TestBed } from '@angular/core/testing';
import { ScheduleUiModule } from './schedule-ui.module';

describe('ScheduleUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ScheduleUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ScheduleUiModule).toBeDefined();
  });
});
