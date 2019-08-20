import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GeoPointViewComponent } from './geo-point-view.component';
import { GeoPoint } from '../geo-point';
import { DebugElement, Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

class GeoPointViewComponentPageObject {
  selector = '.geo-point-view'
  selectors = {
    coordinates: '.coordinates'
  };

  getSelector(name?: string): string {
    if (name && name in this.selectors) {
      return `${this.selector} ${this.selectors[name]}`;
    } else {
      return `${this.selector}`;
    }
  }
}

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
  const pageObject = new GeoPointViewComponentPageObject();

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
    fixture.detectChanges();
  });

  it('should show correct data', async done => {
    const testGeoPoint = GeoPoint.forge();
    component.geoPoint = testGeoPoint;
    await fixture.whenStable();
    fixture.detectChanges();
    const coordinatesElement: HTMLElement = debugElement.query(By.css(pageObject.getSelector('coordinates'))).nativeElement;
    expect(coordinatesElement.innerHTML).toContain(`${testGeoPoint.latitude}, ${testGeoPoint.longitude}`);
    done();
  });
});
