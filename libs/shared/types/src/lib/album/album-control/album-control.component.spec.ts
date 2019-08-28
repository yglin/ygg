import { find } from 'lodash';
import { Component, DebugElement } from '@angular/core';
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
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { AlbumComponent } from '../album.component';
import { MockComponent } from 'ng-mocks';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [
        AlbumControlComponent,
        MockFormComponent,
        MockComponent(AlbumComponent)
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(AlbumControlComponent))
      .componentInstance;
    fixture.detectChanges();
  });

  it('should show @Input() label', async done => {
    formComponent.albumLabel = 'KuKuGaGa';
    await fixture.whenStable();
    fixture.detectChanges();
    const spanLabel: HTMLElement = debugElement.query(
      By.css('.control-label span')
    ).nativeElement;
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
});
