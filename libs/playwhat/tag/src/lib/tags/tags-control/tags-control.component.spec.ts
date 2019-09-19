import 'hammerjs';
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { TagsControlComponent } from './tags-control.component';
import { Component, DebugElement, Injectable } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { ChipsControlComponent } from '@ygg/shared/ui/widgets';
import { MockComponent, MockedComponent } from "ng-mocks";
import { By } from '@angular/platform-browser';
import { Tags } from '../tags';
import { TagsControlComponentPageObject } from './tags-control.component.po';
import { AngularJestTester } from '@ygg/shared/infra/test-utils/jest';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { TagService } from '../../tag.service';
import { take } from 'rxjs/operators';

describe('TagsControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  const stubOptionTags = Tags.forge();

  @Injectable()
  class MockTagService {
    getOptionTags$(taggableType: string): Observable<Tags> {
      return of(stubOptionTags);
    }
  }

  @Component({
    selector: 'ygg-welcome-to-my-form',
    template:
      '<form [formGroup]="formGroup"><ygg-tags-control formControlName="tags" [label]="label"></ygg-tags-control></form>',
    styles: ['']
  })
  class MockFormComponent {
    formGroup: FormGroup;
    label: string;
    constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({
        tags: null
      });
    }
  }

  let formComponent: MockFormComponent;
  let component: TagsControlComponent;
  let mockChipsControlComponent: MockedComponent<ChipsControlComponent>;
  // let chipsControlComponent: ChipsControlComponent;
  let debugElement: DebugElement;
  // let pageObject: TagsControlComponentPageObject;
  let fixture: ComponentFixture<MockFormComponent>;
  let mockTagService: MockTagService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [MockFormComponent, TagsControlComponent, MockComponent(ChipsControlComponent)],
      providers: [{ provide: TagService, useClass: MockTagService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(TagsControlComponent))
      .componentInstance;
    mockChipsControlComponent = debugElement.query(By.css('ygg-chips-control')).componentInstance;
    mockTagService = TestBed.get(TagService);
    fixture.detectChanges();
  });

  it('should pass @Input() label to ygg-chips-control component', async done => {
    formComponent.label = 'BaBaYGG';
    await fixture.whenStable();
    fixture.detectChanges();
    mockChipsControlComponent.label = formComponent.label;
    done();
  });

  it('should pass value from parent form to ygg-chips-control component', async done => {
    jest.spyOn(mockChipsControlComponent, 'writeValue');
    const testTags = Tags.forge();
    formComponent.formGroup.get('tags').setValue(testTags);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(mockChipsControlComponent.writeValue).toHaveBeenCalledWith(testTags.toNameArray());
    done();
  });

  it('should pass changed value from ygg-chips-control component to parent form', async done => {
    const testTags = Tags.forge();
    mockChipsControlComponent.__simulateChange(testTags.toNameArray());
    await fixture.whenStable();
    fixture.detectChanges();
    const formTags: Tags = formComponent.formGroup.get('tags').value;
    expect(formTags.toJSON()).toEqual(testTags.toJSON());
    done();
  });

  it('Should connect optionTags$ to TagService.getOptionTags$() when given taggableType', async done => {
    const testTags = Tags.forge();
    const taggableType = 'garbage';
    jest
      .spyOn(mockTagService, 'getOptionTags$')
      .mockImplementation(() => of(testTags));
    component.taggableType = taggableType;
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    component.optionTags$.pipe(take(1)).subscribe(autoCompleteTags => {
      expect(mockTagService.getOptionTags$).toHaveBeenCalledWith(taggableType);
      expect(autoCompleteTags).toBe(testTags);
      done();
    });
  });

  it('Should pass option tags to ygg-chips-control component', async done => {
    const testTags = Tags.forge();
    component.optionTags$ = of(testTags);
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(mockChipsControlComponent.autocompleteOptions).toEqual(testTags.toNameArray());
    done();
  });
});
