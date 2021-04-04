import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationViewCompactComponent } from './location-view-compact.component';

describe('LocationViewCompactComponent', () => {
  let component: LocationViewCompactComponent;
  let fixture: ComponentFixture<LocationViewCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationViewCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationViewCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
