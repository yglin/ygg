import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ScheduleFormService } from './schedule-form.service';

describe('ScheduleFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ReactiveFormsModule]
  }));

  it('should be created', () => {
    const service: ScheduleFormService = TestBed.get(ScheduleFormService);
    expect(service).toBeTruthy();
  });
});
