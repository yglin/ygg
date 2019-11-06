import { async, TestBed } from '@angular/core/testing';
import { ScheduleFactoryModule } from './schedule-factory.module';

describe('ScheduleFactoryModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ScheduleFactoryModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ScheduleFactoryModule).toBeDefined();
  });
});
