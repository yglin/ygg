import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleFormEditPageComponent } from './schedule-form-edit-page.component';

describe('ScheduleFormEditPageComponent', () => {
  let component: ScheduleFormEditPageComponent;
  let fixture: ComponentFixture<ScheduleFormEditPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleFormEditPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleFormEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
