import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser";
import { Image } from "./image";
import { ImageComponent } from './image.component';
import { SharedUiNgMaterialModule } from "@ygg/shared/ui/ng-material";

describe('ImageComponent', () => {
  let component: ImageComponent;
  let fixture: ComponentFixture<ImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageComponent ],
      imports: [SharedUiNgMaterialModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show specific view corresponding to image type and src', () => {
    const debugElement = fixture.debugElement;
    // default image
    const testImage = new Image();
    component.image = testImage;
    fixture.detectChanges();
    const imgDefault = debugElement.query(By.css(`.asset img[src="${Image.DEFAULT_IMAGE_SRC}"]`));
    expect(imgDefault).toBeDefined();

    // source from asset
    const penguin = '/assets/images/penguin.jpg';
    testImage.src = penguin;
    fixture.detectChanges();
    const imgPenguin = debugElement.query(By.css(`.asset img[src="${penguin}"]`));
    expect(imgPenguin).toBeDefined();

    // source from external site
    const capybara = 'https://commons.wikimedia.org/wiki/File:Yellow-headed_caracara_(Milvago_chimachima)_on_capybara_(Hydrochoeris_hydrochaeris).JPG#/media/File:Yellow-headed_caracara_(Milvago_chimachima)_on_capybara_(Hydrochoeris_hydrochaeris).JPG';
    testImage.src = capybara;
    fixture.detectChanges();
    const imgCapybara = debugElement.query(By.css(`.external img[src="${capybara}"]`));
    expect(imgCapybara).toBeDefined();

    // source as font-icon
    const iconName = 'people';
    testImage.src = iconName;
    fixture.detectChanges();
    const icon: HTMLElement = debugElement.query(By.css(`.font-icon .mat-icon`)).nativeElement;
    expect(icon.textContent).toEqual(iconName);
  });
});
