import { find } from 'lodash';
import { Component, OnInit, DebugElement, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumControlComponent } from './album-control.component';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Album } from '../album';
import { take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Image } from '../../image';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

const newImages = [
  'https://pics.awwmemes.com/1-serving-of-the-birb-34792574.png',
  'https://pics.me.me/birb-43264589.png',
  'https://pics.me.me/funny-bird-birb-meme-giggles-53559748.png',
  'http://images3.memedroid.com/images/UPLOADED321/5a16d295305c6.jpeg'
].map(src => new Image(src));

@Injectable()
class MockYggDialog {
  open() {
    return {
      afterClosed: () => of(newImages)
    };
  }
}

describe('AlbumControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  @Component({
    selector: 'ygg-welcome-to-my-form',
    template:
      '<form [formGroup]="formGroup"><ygg-album-control formControlName="myAlbum" [label]="albumLabel"></ygg-album-control></form>',
    styles: ['']
  })
  class MockFormComponent {
    formGroup: FormGroup;
    albumLabel: string;
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
  let mockYggDialog: MockYggDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [AlbumControlComponent, MockFormComponent],
      providers: [{ provide: YggDialogService, useClass: MockYggDialog }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(AlbumControlComponent))
      .componentInstance;
    mockYggDialog = TestBed.get(YggDialogService);
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    fixture.detectChanges();
  });

  it('should show @Input() label', async done => {
    formComponent.albumLabel = 'KuKuGaGa';
    await fixture.whenStable();
    fixture.detectChanges();
    const spanLabel: HTMLElement = debugElement.query(By.css('.control-label span')).nativeElement;
    expect(spanLabel.textContent).toEqual(formComponent.albumLabel);
    done();
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
    formComponent.formGroup
      .get('myAlbum')
      .valueChanges.pipe(take(1))
      .subscribe(value => {
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
    formComponent.formGroup
      .get('myAlbum')
      .valueChanges.pipe(take(3))
      .subscribe(
        album => {
          expect(album.toJSON()).toEqual(component.album.toJSON());
        },
        () => {},
        () => done()
      );
    component.addPhoto();
    component.deletePhoto(0);
    component.setCover(0);
  });
});

describe('AlbumControlComponent', () => {
  let component: AlbumControlComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<AlbumControlComponent>;
  let mockYggDialog: MockYggDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [AlbumControlComponent],
      providers: [{ provide: YggDialogService, useClass: MockYggDialog }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumControlComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    component.album = Album.forge();
    mockYggDialog = TestBed.get(YggDialogService);
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    fixture.detectChanges();
  });

  it('should be able to add new image', async done => {
    component.addPhoto();
    await fixture.whenStable();
    fixture.detectChanges();
    for (
      let i = component.album.photos.length - newImages.length, j = 0;
      i < component.album.photos.length;
      i++, j++
    ) {
      const photo = component.album.photos[i];
      expect(photo.src).toEqual(newImages[j].src);
      expect(
        debugElement.query(By.css(`img[src="${photo.src}"]`))
      ).not.toBeNull();
    }
    done();
  });

  it('should be able to delete image', async done => {
    const lastIndex = component.album.photos.length - 1;
    const lastPhoto = component.album.photos[lastIndex];
    component.deletePhoto(lastIndex);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.album.photos.length).toBe(lastIndex);
    expect(
      debugElement.query(By.css(`.photo-list #photo-${lastIndex}.photo`))
    ).toBeNull();
    done();
  });

  it('should be able to choose cover photo', async done => {
    const coverImg: HTMLImageElement = debugElement.query(By.css('.cover img'))
      .nativeElement;
    const firstPhoto = component.album.photos[0];
    const firstPhotoImg: HTMLImageElement = debugElement.query(
      By.css('.photo-list #photo-0.photo img')
    ).nativeElement;
    firstPhotoImg.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(coverImg.src).toEqual(firstPhoto.src);

    const lastIndex = component.album.photos.length - 1;
    const lastPhoto = component.album.photos[lastIndex];
    const lastPhotoImg: HTMLImageElement = debugElement.query(
      By.css(`.photo-list #photo-${lastIndex}.photo img`)
    ).nativeElement;
    lastPhotoImg.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(coverImg.src).toEqual(lastPhoto.src);

    done();
  });
});
