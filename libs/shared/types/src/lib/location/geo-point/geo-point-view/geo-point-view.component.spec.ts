import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeoPointViewComponent } from './geo-point-view.component';
import { GeoPoint } from '../geo-point';
import { DebugElement, Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { AngularJestTester } from "@ygg/shared/infra/test-utils";
import { GeoPointViewComponentPageObject } from './geo-point-view.component.po';

@Component({
  selector: 'agm-map',
  template: '',
  styles: ['']
})
class MockAgmMapComponent {
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() zoom: number;
}

@Component({
  selector: 'agm-marker',
  template: '',
  styles: ['']
})
class MockAgmMarkerComponent {
  @Input() latitude: number;
  @Input() longitude: number;
}


describe('GeoPointViewComponent', () => {
  let component: GeoPointViewComponent;
  let fixture: ComponentFixture<GeoPointViewComponent>;
  let debugElement: DebugElement;
  let pageObject: GeoPointViewComponentPageObject;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiNgMaterialModule],
      declarations: [ GeoPointViewComponent, MockAgmMapComponent, MockAgmMarkerComponent ]
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
