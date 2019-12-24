import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageThumbnailListComponent } from './image-thumbnail-list.component';

describe('ImageThumbnailListComponent', () => {
  let component: ImageThumbnailListComponent;
  let fixture: ComponentFixture<ImageThumbnailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageThumbnailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageThumbnailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
