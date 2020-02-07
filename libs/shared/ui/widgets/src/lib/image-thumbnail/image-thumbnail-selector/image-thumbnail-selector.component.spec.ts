import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageThumbnailSelectorComponent } from './image-thumbnail-selector.component';

describe('ImageThumbnailSelectorComponent', () => {
  let component: ImageThumbnailSelectorComponent;
  let fixture: ComponentFixture<ImageThumbnailSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageThumbnailSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageThumbnailSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
