import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoPointComponent } from './geo-point.component';

describe('GeoPointComponent', () => {
  let component: GeoPointComponent;
  let fixture: ComponentFixture<GeoPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
