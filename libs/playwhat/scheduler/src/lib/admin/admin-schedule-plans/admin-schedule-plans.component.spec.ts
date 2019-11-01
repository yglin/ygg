import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from "ng-mocks";
import { SchedulePlanTableComponent } from "../../schedule-plan/schedule-plan-table/schedule-plan-table.component";
import { AdminSchedulePlansComponent } from './admin-schedule-plans.component';

describe('AdminSchedulePlansComponent', () => {
  let component: AdminSchedulePlansComponent;
  let fixture: ComponentFixture<AdminSchedulePlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSchedulePlansComponent, MockComponent(SchedulePlanTableComponent)],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSchedulePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
