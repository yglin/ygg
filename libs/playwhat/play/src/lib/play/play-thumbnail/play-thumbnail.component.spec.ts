import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayThumbnailComponent } from './play-thumbnail.component';

describe('PlayThumbnailComponent', () => {
  let component: PlayThumbnailComponent;
  let fixture: ComponentFixture<PlayThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
