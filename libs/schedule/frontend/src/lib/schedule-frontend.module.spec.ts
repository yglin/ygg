import { async, TestBed } from '@angular/core/testing';
import { ScheduleFrontendModule } from './schedule-frontend.module';

describe('ScheduleFrontendModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ScheduleFrontendModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ScheduleFrontendModule).toBeDefined();
  });
});
