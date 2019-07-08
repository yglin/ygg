import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from "ng-mocks";
import { ScheduleFormsTableComponent } from "../../schedule-form/schedule-forms-table/schedule-forms-table.component";
import { AdminScheduleFormsComponent } from './admin-schedule-forms.component';

describe('AdminScheduleFormsComponent', () => {
  let component: AdminScheduleFormsComponent;
  let fixture: ComponentFixture<AdminScheduleFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminScheduleFormsComponent, MockComponent(ScheduleFormsTableComponent)],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScheduleFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
