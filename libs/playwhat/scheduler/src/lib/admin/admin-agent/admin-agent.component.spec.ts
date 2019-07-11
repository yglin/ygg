import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from "ng-mocks";
import { AdminAgentComponent } from './admin-agent.component';
import { SchedulerAdminService } from "../scheduler-admin.service";
import { UserSelectorComponent } from 'libs/shared/user/src/lib/components/user-selector/user-selector.component';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

describe('AdminAgentComponent', () => {
  let component: AdminAgentComponent;
  let fixture: ComponentFixture<AdminAgentComponent>;

  const fakeAgentIds = ['fake', 'fraud', 'theft'];

  @Injectable()
  class MockSchedulerAdminService {
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
      providers: [{provide: SchedulerAdminService, useClass: MockSchedulerAdminService}]
    })
    .compileComponents();
  }));

  // beforeEach(() => {
  // });

  it('should call schedulerAdminService.getData$("agent") to fetch agent ids', () => {
    const mockSchedulerAdminService: MockSchedulerAdminService = TestBed.get(SchedulerAdminService);
    jest.spyOn(mockSchedulerAdminService, 'getData$').mockImplementation(() => of(fakeAgentIds));
    fixture = TestBed.createComponent(AdminAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
    expect(mockSchedulerAdminService.getData$).toHaveBeenCalledWith('agent');
    expect(component.agentIds).toEqual(fakeAgentIds);   
  });

  it('should call schedulerAdminService.setData("agent", newData) to update agent ids', done => {
    fixture = TestBed.createComponent(AdminAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
    const mockSchedulerAdminService: MockSchedulerAdminService = TestBed.get(SchedulerAdminService);
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(mockSchedulerAdminService, 'setData').mockImplementation(() => Promise.resolve());
    component.onSubmit(fakeAgentIds).then(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();
      expect(mockSchedulerAdminService.setData).toHaveBeenCalledWith('agent', fakeAgentIds);
      done();
    });
  });
});
