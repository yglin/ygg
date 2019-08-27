import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationViewComponent } from './location-view.component';
import { Location } from '../location';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LocationViewComponentPageObject } from "./location-view.component.po";
import { AngularJestTester } from '@ygg/shared/infra/test-utils/jest';
import { AddressViewComponent } from '../address';
import { GeoPointViewComponent } from '../geo-point';
import { MockAgmMapComponent, MockAgmMarkerComponent } from "../geo-point/index.po";
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

describe('LocationViewComponent', () => {
  let component: LocationViewComponent;
  let fixture: ComponentFixture<LocationViewComponent>;
  let debugElement: DebugElement;
  let pageObject: LocationViewComponentPageObject;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiNgMaterialModule],
      declarations: [ LocationViewComponent, AddressViewComponent, GeoPointViewComponent, MockAgmMapComponent, MockAgmMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationViewComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    const tester = new AngularJestTester({ debugElement });
    pageObject = new LocationViewComponentPageObject(tester, '');
    fixture.detectChanges();
  });

  it('should show correct data', async done => {
    const testLocation = Location.forge();
    component.location = testLocation;
    await fixture.whenStable();
    fixture.detectChanges();
    pageObject.expectValue(testLocation);
    done();
  });
});
