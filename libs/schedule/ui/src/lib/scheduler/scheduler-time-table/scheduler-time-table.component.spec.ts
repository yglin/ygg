import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerTimeTableComponent } from './scheduler-time-table.component';

describe('SchedulerTimeTableComponent', () => {
  let component: SchedulerTimeTableComponent;
  let fixture: ComponentFixture<SchedulerTimeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerTimeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
