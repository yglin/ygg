import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheThingThumbnailComponent } from './the-thing-thumbnail.component';

describe('TheThingThumbnailComponent', () => {
  let component: TheThingThumbnailComponent;
  let fixture: ComponentFixture<TheThingThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheThingThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheThingThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
