import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceThumbnailComponent } from './resource-thumbnail.component';

describe('ResourceThumbnailComponent', () => {
  let component: ResourceThumbnailComponent;
  let fixture: ComponentFixture<ResourceThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
