import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePlanListPageComponent } from './schedule-plan-list-page.component';

describe('SchedulePlanListPageComponent', () => {
  let component: SchedulePlanListPageComponent;
  let fixture: ComponentFixture<SchedulePlanListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulePlanListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePlanListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
