import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationThumbnailComponent } from './accommodation-thumbnail.component';

describe('AccommodationThumbnailComponent', () => {
  let component: AccommodationThumbnailComponent;
  let fixture: ComponentFixture<AccommodationThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccommodationThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccommodationThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
