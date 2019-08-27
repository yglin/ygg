import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockAgmMapComponent, MockAgmMarkerComponent } from './mock-agm-map.po';
import { GoogleMapComponent } from './google-map.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

describe('GoogleMapComponent', () => {
  let component: GoogleMapComponent;
  let fixture: ComponentFixture<GoogleMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiNgMaterialModule],
      declarations: [ GoogleMapComponent, MockAgmMapComponent, MockAgmMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
