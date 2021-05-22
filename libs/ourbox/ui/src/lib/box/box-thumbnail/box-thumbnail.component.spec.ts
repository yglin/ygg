import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxThumbnailComponent } from './box-thumbnail.component';

describe('BoxThumbnailComponent', () => {
  let component: BoxThumbnailComponent;
  let fixture: ComponentFixture<BoxThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
