import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from "ng-mocks";
import { ScheduleFormTableComponent } from "../../schedule-form/schedule-form-table/schedule-form-table.component";
import { AdminScheduleFormsComponent } from './admin-schedule-forms.component';

describe('AdminScheduleFormsComponent', () => {
  let component: AdminScheduleFormsComponent;
  let fixture: ComponentFixture<AdminScheduleFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminScheduleFormsComponent, MockComponent(ScheduleFormTableComponent)],
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
