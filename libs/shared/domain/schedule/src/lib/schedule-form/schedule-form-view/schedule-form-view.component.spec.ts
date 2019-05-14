import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleFormViewComponent } from './schedule-form-view.component';

describe('ScheduleFormViewComponent', () => {
  let component: ScheduleFormViewComponent;
  let fixture: ComponentFixture<ScheduleFormViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleFormViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
