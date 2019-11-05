import { async, TestBed } from '@angular/core/testing';
import { ScheduleDataAccessModule } from './schedule-data-access.module';

describe('ScheduleDataAccessModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ScheduleDataAccessModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ScheduleDataAccessModule).toBeDefined();
  });
});
