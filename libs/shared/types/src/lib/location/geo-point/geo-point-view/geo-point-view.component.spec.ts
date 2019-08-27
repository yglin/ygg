import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeoPointViewComponent } from './geo-point-view.component';
import { GeoPoint } from '../geo-point';
import { DebugElement, Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { AngularJestTester } from "@ygg/shared/infra/test-utils/jest";
import { GeoPointViewComponentPageObject } from './geo-point-view.component.po';
import { MockComponent } from 'ng-mocks';
import { GoogleMapComponent } from '../google-map/google-map.component';

describe('GeoPointViewComponent', () => {
  let component: GeoPointViewComponent;
  let fixture: ComponentFixture<GeoPointViewComponent>;
  let debugElement: DebugElement;
  let pageObject: GeoPointViewComponentPageObject;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiNgMaterialModule],
      declarations: [ GeoPointViewComponent, MockComponent(GoogleMapComponent) ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoPointViewComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    const tester = new AngularJestTester({ debugElement });
    pageObject = new GeoPointViewComponentPageObject(tester, '');

    fixture.detectChanges();
  });

  it('should show correct data', async done => {
    const testGeoPoint = GeoPoint.forge();
    component.geoPoint = testGeoPoint;
    await fixture.whenStable();
    fixture.detectChanges();
    pageObject.expectValue(testGeoPoint);
    done();
  });
});
