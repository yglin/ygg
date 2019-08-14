import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoPointControlComponent } from './geo-point-control.component';

describe('GeoPointControlComponent', () => {
  let component: GeoPointControlComponent;
  let fixture: ComponentFixture<GeoPointControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoPointControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoPointControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
