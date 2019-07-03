import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleFormListComponent } from './schedule-form-list.component';

describe('ScheduleFormListComponent', () => {
  let component: ScheduleFormListComponent;
  let fixture: ComponentFixture<ScheduleFormListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleFormListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
