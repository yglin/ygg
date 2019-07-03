import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerDashboardComponent } from './scheduler-dashboard.component';

describe('SchedulerDashboardComponent', () => {
  let component: SchedulerDashboardComponent;
  let fixture: ComponentFixture<SchedulerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
