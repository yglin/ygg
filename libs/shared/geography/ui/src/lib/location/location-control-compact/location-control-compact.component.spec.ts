import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationControlCompactComponent } from './location-control-compact.component';

describe('LocationControlCompactComponent', () => {
  let component: LocationControlCompactComponent;
  let fixture: ComponentFixture<LocationControlCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationControlCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationControlCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
