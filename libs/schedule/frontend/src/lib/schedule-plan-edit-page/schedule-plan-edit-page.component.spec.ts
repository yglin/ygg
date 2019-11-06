import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePlanEditPageComponent } from './schedule-plan-edit-page.component';

describe('SchedulePlanEditPageComponent', () => {
  let component: SchedulePlanEditPageComponent;
  let fixture: ComponentFixture<SchedulePlanEditPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulePlanEditPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePlanEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
