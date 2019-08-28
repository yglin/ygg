import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumComponent } from './album.component';
import { Image } from '../image';
import { Injectable, DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Album } from './album';

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

describe('AlbumComponent', () => {
  let component: AlbumComponent;
  let fixture: ComponentFixture<AlbumComponent>;
  let debugElement: DebugElement;
  let mockYggDialog: MockYggDialog;

  beforeAll(function() {
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule, FlexLayoutModule],
      declarations: [ AlbumComponent ],
      providers: [{ provide: YggDialogService, useClass: MockYggDialog }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    mockYggDialog = TestBed.get(YggDialogService);
    component.album = Album.forge();
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
