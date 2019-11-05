import { async, TestBed } from '@angular/core/testing';
import { ScheduleAdminModule } from './schedule-admin.module';

describe('ScheduleAdminModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ScheduleAdminModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ScheduleAdminModule).toBeDefined();
  });
});
