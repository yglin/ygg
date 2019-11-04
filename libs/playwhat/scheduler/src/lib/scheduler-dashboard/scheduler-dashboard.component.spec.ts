import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerDashboardComponent } from './scheduler-dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SchedulerDashboardComponent', () => {
  let component: SchedulerDashboardComponent;
  let fixture: ComponentFixture<SchedulerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulerDashboardComponent],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'plans', redirectTo: 'home' }])
      ]
    }).compileComponents();
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
