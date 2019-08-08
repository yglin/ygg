import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from "ng-mocks";
import { BusinessHoursViewComponent } from './business-hours-view.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { BusinessHours } from '../business-hours';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { OpenHourComponent } from '../open-hour/open-hour.component';

describe('BusinessHoursViewComponent', () => {
  let component: BusinessHoursViewComponent;
  let fixture: ComponentFixture<BusinessHoursViewComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiNgMaterialModule],
      declarations: [ BusinessHoursViewComponent, MockComponent(OpenHourComponent) ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessHoursViewComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should display business-hours', async done => {
    const testBusinessHours = BusinessHours.forge();
    component.businessHours = testBusinessHours;
    await fixture.whenStable();
    fixture.detectChanges();
    let mockedOpenHourComponent: OpenHourComponent;
    const openHours = testBusinessHours.getOpenHours();
    for (let index = 0; index < openHours.length; index++) {
      mockedOpenHourComponent = debugElement.query(By.css(`ygg-open-hour#open-hour-${index}`)).componentInstance;
      expect(mockedOpenHourComponent.openHour).toBe(openHours[index]);
    }
    done();
  });
});
