import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationEditComponent } from './accommodation-edit.component';

describe('AccommodationEditComponent', () => {
  let component: AccommodationEditComponent;
  let fixture: ComponentFixture<AccommodationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccommodationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccommodationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
