import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from "ng-mocks";
import { AdminAgentComponent } from './admin-agent.component';
import { ScheduleAdminService } from "../schedule-admin.service";
import { UserSelectorComponent } from "@ygg/shared/user/ui";
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

describe('AdminAgentComponent', () => {
  let component: AdminAgentComponent;
  let fixture: ComponentFixture<AdminAgentComponent>;

  const fakeAgentIds = ['fake', 'fraud', 'theft'];

  @Injectable()
  class MockScheduleAdminService {
    getData$() {
      return of(null);
    }
    setData() {
      return Promise.resolve();
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAgentComponent, MockComponent(UserSelectorComponent)],
      providers: [{provide: ScheduleAdminService, useClass: MockScheduleAdminService}]
    })
    .compileComponents();
  }));

  // beforeEach(() => {
  // });

  it('should call schedulerAdminService.getData$("agent") to fetch agent ids', () => {
    const mockScheduleAdminService: MockScheduleAdminService = TestBed.get(ScheduleAdminService);
    jest.spyOn(mockScheduleAdminService, 'getData$').mockImplementation(() => of(fakeAgentIds));
    fixture = TestBed.createComponent(AdminAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
    expect(mockScheduleAdminService.getData$).toHaveBeenCalledWith('agent');
    expect(component.agentIds).toEqual(fakeAgentIds);   
  });

  it('should call schedulerAdminService.setData("agent", newData) to update agent ids', done => {
    fixture = TestBed.createComponent(AdminAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
    const mockScheduleAdminService: MockScheduleAdminService = TestBed.get(ScheduleAdminService);
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(mockScheduleAdminService, 'setData').mockImplementation(() => Promise.resolve());
    component.onSubmit(fakeAgentIds).then(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();
      expect(mockScheduleAdminService.setData).toHaveBeenCalledWith('agent', fakeAgentIds);
      done();
    });
  });
});
