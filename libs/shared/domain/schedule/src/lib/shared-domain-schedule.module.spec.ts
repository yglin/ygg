import { async, TestBed } from '@angular/core/testing';
import { SharedDomainScheduleModule } from './shared-domain-schedule.module';

describe('SharedDomainScheduleModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedDomainScheduleModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedDomainScheduleModule).toBeDefined();
  });
});
