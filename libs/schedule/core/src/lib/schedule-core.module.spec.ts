import { async, TestBed } from '@angular/core/testing';
import { ScheduleCoreModule } from './schedule-core.module';

describe('ScheduleCoreModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ScheduleCoreModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ScheduleCoreModule).toBeDefined();
  });
});
