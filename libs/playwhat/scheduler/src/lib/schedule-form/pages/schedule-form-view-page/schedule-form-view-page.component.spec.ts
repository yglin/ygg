import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleFormViewPageComponent } from './schedule-form-view-page.component';

describe('ScheduleFormViewPageComponent', () => {
  let component: ScheduleFormViewPageComponent;
  let fixture: ComponentFixture<ScheduleFormViewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleFormViewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleFormViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
