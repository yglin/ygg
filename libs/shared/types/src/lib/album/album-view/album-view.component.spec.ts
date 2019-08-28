import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumViewComponent } from './album-view.component';
import { MockComponent } from 'ng-mocks';
import { AlbumComponent } from '../album.component';

describe('AlbumViewComponent', () => {
  let component: AlbumViewComponent;
  let fixture: ComponentFixture<AlbumViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumViewComponent, MockComponent(AlbumComponent) ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
