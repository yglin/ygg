import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionThumbnailComponent } from './addition-thumbnail.component';

describe('AdditionThumbnailComponent', () => {
  let component: AdditionThumbnailComponent;
  let fixture: ComponentFixture<AdditionThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
