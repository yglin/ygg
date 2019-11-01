import { DebugElement, Inject, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SharedTypesModule, DATE_FORMATS } from '@ygg/shared/types';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import * as moment from 'moment';

import { SchedulePlan } from '../schedule-plan';
import { SchedulePlanViewComponent } from './schedule-plan-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { SchedulePlanService } from '../schedule-plan.service';
import { User, AuthenticateService } from '@ygg/shared/user';
import { AngularJestTester } from "@ygg/shared/test/angular-jest";
import { SchedulePlanViewPageObject } from "./schedule-plan-view.component.po";
import { TagsUiModule } from '@ygg/tags/ui';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';

// function getFieldElement(
//   dbElement: DebugElement,
//   fieldName: string
// ): HTMLElement {
//   return dbElement.query(By.css(`#${fieldName} .value`)).nativeElement;
// }

// function countPluralField(dbElement: DebugElement, fieldName: string): number {
//   return dbElement.query(By.css(`#${fieldName}`)).queryAll(By.css('.value'))
//     .length;
// }

// function getValueText(dbElement: DebugElement, fieldName: string): string {
//   return getFieldElement(dbElement, fieldName).textContent;
// }

class SchedulePlanViewPageObjectAngularJest extends SchedulePlanViewPageObject {
  tester: AngularJestTester;

  constructor(parentSelector: string, tester: AngularJestTester) {
    super(parentSelector);
    this.tester = tester;
  }

  expectValue(schedulePlan: SchedulePlan) {
    // TO BE Implement...
  }

  expectEditButton(flag: boolean) {
    this.tester.expectVisible(this.getSelector('buttonEdit'), flag);
  }

  async gotoEdit() {
    return this.tester.click(this.getSelector('buttonEdit'));
  }
}

describe('SchedulePlanViewComponent', () => {
  let component: SchedulePlanViewComponent;
  let fixture: ComponentFixture<SchedulePlanViewComponent>;
  let debugElement: DebugElement;

  @Injectable()
  class MockAuthenticateService {
    currentUser$: BehaviorSubject<User> = new BehaviorSubject(null);
  }
  
  @Injectable()
  class MockActivatedRoute {
    snapshot = {
      paramMap: {
        get: () => 'fakeId'
      }
    };
    data = of(null);
  }

  @Injectable()
  class MockRouter {
    navigate() {}
  }

  @Injectable()
  class MockSchedulePlanService {
    get$() {
      return of(null);
    }
  }

  let mockAuthenticateService: MockAuthenticateService;
  let mockRouter: MockRouter;
  let mockActivatedRoute: MockActivatedRoute;
  let schedulePlanViewPageObject: SchedulePlanViewPageObjectAngularJest;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SchedulePlanViewComponent],
      imports: [SharedUiNgMaterialModule, SharedUiWidgetsModule, SharedTypesModule, TagsUiModule],
      providers: [
        { provide: AuthenticateService, useClass: MockAuthenticateService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: SchedulePlanService, useClass: MockSchedulePlanService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePlanViewComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    mockAuthenticateService = TestBed.get(AuthenticateService);
    mockRouter = TestBed.get(Router);
    mockActivatedRoute = TestBed.get(ActivatedRoute);
    const tester = new AngularJestTester({ fixture, debugElement });
    schedulePlanViewPageObject = new SchedulePlanViewPageObjectAngularJest('', tester);
  });

  // it('should display correct data', async done => {
  //   const testSchedulePlan = SchedulePlan.forge();
  //   component.schedulePlan = testSchedulePlan;
  //   await fixture.whenStable();
  //   fixture.detectChanges();
  //   schedulePlanViewPageObject.expectValue(testSchedulePlan);
  //   done();
  // });  
});
