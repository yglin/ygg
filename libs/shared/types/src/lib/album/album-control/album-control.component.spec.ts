import { Component, OnInit, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumControlComponent } from './album-control.component';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Album } from '../album';
import { take } from 'rxjs/operators';

describe('AlbumControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  @Component({
    selector: 'ygg-welcome-to-my-form',
    template: '<form [formGroup]="formGroup"><ygg-album-control formControlName="myAlbum"></ygg-album-control></form>',
    styles: ['']
  })
  class MockFormComponent {
    formGroup: FormGroup;
    constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({
        myAlbum: null
      });
    }
  }
  
  let formComponent: MockFormComponent;
  let component: AlbumControlComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<MockFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ AlbumControlComponent, MockFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(AlbumControlComponent)).componentInstance;
    fixture.detectChanges();
  });


  it('should read value from parent form', async done => {
    const testAlbum = Album.forge();
    formComponent.formGroup.get('myAlbum').setValue(testAlbum);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.album).toBe(testAlbum);
    done();
  });

  it('should output changed value to parent form', async done => {
    const testAlbum = Album.forge();
    formComponent.formGroup.get('myAlbum').valueChanges.pipe(take(1)).subscribe(value => {
      expect(value).toBe(testAlbum);
      done();
    });
    component.album = testAlbum;
    await fixture.whenStable();
    fixture.detectChanges();
  });
  
  it('should output change after each operation', done => {
    const testAlbum = Album.forge();
    component.album = testAlbum;
    formComponent.formGroup.get('myAlbum').valueChanges.pipe(take(3)).subscribe(album => {
      expect(album.toJSON()).toEqual(component.album.toJSON());
    }, () => {}, () => done());
    component.addImage();
    component.deleteImage(0);
    component.setCover(0);
  });
});

describe('AlbumControlComponent', () => {
  let component: AlbumControlComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<AlbumControlComponent>;
  const newImageSrc = 'https://pics.awwmemes.com/1-serving-of-the-birb-34792574.png';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumControlComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    component.album = Album.forge();
    fixture.detectChanges();
  });

  it('should be able to add new image', () => {
    component.addImage();
    const lastIndex = component.album.photos.length - 1;
    const lastPhoto = component.album.photos[lastIndex];
    expect(lastPhoto.src).toEqual(newImageSrc);
    const lastPhotoImg: HTMLImageElement = debugElement.query(By.css('#photo-list .photo[last] img')).nativeElement;
    expect(lastPhotoImg.src).toEqual(newImageSrc);
  });

  it('should be able to delete image', () => {
    const lastIndex = component.album.photos.length - 1;
    const lastPhoto = component.album.photos[lastIndex];
    component.deleteImage(lastIndex);
    expect(debugElement.query(By.css(`img[src="${lastPhoto.src}"]`))).toBeNull();
  });

  it('should be able to choose cover photo', async done => {
    const coverImg: HTMLImageElement = debugElement.query(By.css('#cover .photo img')).nativeElement;
    const firstPhoto = component.album.photos[0];
    const firstPhotoImg: HTMLImageElement = debugElement.query(By.css('#photo-list .photo[first] img')).nativeElement;
    firstPhotoImg.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(coverImg.src).toEqual(firstPhoto.src);

    const lastIndex = component.album.photos.length - 1;
    const lastPhoto = component.album.photos[lastIndex];
    const lastPhotoImg: HTMLImageElement = debugElement.query(By.css('#photo-list .photo[last] img')).nativeElement;
    lastPhotoImg.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(coverImg.src).toEqual(lastPhoto.src);

    done();
  });
  
});
