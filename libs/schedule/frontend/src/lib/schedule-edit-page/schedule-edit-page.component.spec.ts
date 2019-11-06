import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleEditPageComponent } from './schedule-edit-page.component';

describe('ScheduleEditPageComponent', () => {
  let component: ScheduleEditPageComponent;
  let fixture: ComponentFixture<ScheduleEditPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleEditPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
