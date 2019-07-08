import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleFormsTableComponent } from './schedule-forms-table.component';

describe('ScheduleFormsTableComponent', () => {
  let component: ScheduleFormsTableComponent;
  let fixture: ComponentFixture<ScheduleFormsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleFormsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleFormsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
