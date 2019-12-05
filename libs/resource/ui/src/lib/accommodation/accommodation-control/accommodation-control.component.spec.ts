import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationControlComponent } from './accommodation-control.component';

describe('AccommodationControlComponent', () => {
  let component: AccommodationControlComponent;
  let fixture: ComponentFixture<AccommodationControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccommodationControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccommodationControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
