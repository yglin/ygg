import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePlanViewPageComponent } from './schedule-plan-view-page.component';

describe('SchedulePlanViewPageComponent', () => {
  let component: SchedulePlanViewPageComponent;
  let fixture: ComponentFixture<SchedulePlanViewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulePlanViewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePlanViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
