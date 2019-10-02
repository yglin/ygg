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
import { MockComponent, MockedComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { Tags, Tag, TaggableType } from '@ygg/tags/core';
import { TagsControlComponentPageObject } from './tags-control.component.po';
import { AngularJestTester } from '@ygg/shared/test/angular-jest';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { TagsService } from '@ygg/tags/data-access';
import { take } from 'rxjs/operators';

// class TagsControlComponentPageObjectAngularJest extends TagsControlComponentPageObject {
//   tester: AngularJestTester;

//   constructor(parentSelector: string, tester: AngularJestTester) {
//     super(parentSelector);
//     this.tester = tester;
//   }

//   async setValue(tags: Tags) {
//     await this.clearAll();
//     for (const tag of tags.toTagsArray()) {
//       await this.tester.inputText(this.getSelector('inputTagName'), tag.name);
//       await this.tester.click(this.getSelector('buttonAdd'));
//       await this.tester.expectVisible(this.getSelectorForTagChip(tag), true);
//     }
//   }

//   async clearAll() {
//     return this.tester.click(this.getSelector('buttonClear'));
//   }

//   async removeTag(tag: Tag) {
//     return this.tester.click(this.getSelectorForTagDeleteButton(tag));
//   }

//   // yglin: 2019/08/30
//   // This method is useless right now,
//   // because I can't get the autocomplete panel hidden as expect after clearInput().
//   // It behaves normal outside test, so I'll postpone this.
//   expectAutoCompleteDropdownVisible(flag: boolean) {
//     this.tester.expectVisible(this.getSelectorForAutocompletePanel(), flag);
//   }

//   async typeIntoName(letter: string) {
//     return this.tester.type(this.getSelector('inputTagName'), letter);
//   }

//   async clearInput() {
//     return this.tester.inputText(this.getSelector('inputTagName'), '');
//   }

//   async expectAutoCompleteDropdownOptions(values: string[]) {
//     for (const value of values) {
//       await this.tester.expectVisible(
//         this.getSelectorForAutocompleteOption(value),
//         true
//       );
//     }
//     return Promise.resolve();
//   }
// }

describe('TagsControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  const stubOptionTags = Tags.forge().toTagsArray();
  const stubTaggableTypes = [
    {
      id: 'ggyy',
      label: 'GGYY',
      collection: 'garbages'
    }
  ];

  @Injectable()
  class MockTagsService {
    getOptionTags$(taggableType: TaggableType): Observable<Tag[]> {
      return of(stubOptionTags);
    }

    getTaggableTypes$(): Observable<TaggableType[]> {
      return of(stubTaggableTypes);
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
  let mockTagsService: MockTagsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [
        MockFormComponent,
        TagsControlComponent,
        MockComponent(ChipsControlComponent)
      ],
      providers: [{ provide: TagsService, useClass: MockTagsService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(TagsControlComponent))
      .componentInstance;
    mockChipsControlComponent = debugElement.query(By.css('ygg-chips-control'))
      .componentInstance;
    mockTagsService = TestBed.get(TagsService);
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
    expect(mockChipsControlComponent.writeValue).toHaveBeenCalledWith(
      testTags.toNameArray()
    );
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

  it('Should fetch taggable-types on init, and pass the received taggableType to TagsService.getOptionTags$', async done => {
    jest.spyOn(mockTagsService, 'getTaggableTypes$');
    jest.spyOn(mockTagsService, 'getOptionTags$');
    component.taggableType = stubTaggableTypes[0].id;
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(mockTagsService.getTaggableTypes$).toHaveBeenCalled();
    expect(mockTagsService.getOptionTags$).toHaveBeenCalledWith(
      stubTaggableTypes[0]
    );
    done();
  });

  it('Should pass TagsService.getOptionTags$() as names array to chipControlComponet.autocompleteOptions', async done => {
    jest.spyOn(mockTagsService, 'getOptionTags$');
    component.taggableType = stubTaggableTypes[0].id;
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(mockTagsService.getOptionTags$).toHaveBeenCalled();
    expect(mockChipsControlComponent.autocompleteOptions).toEqual(stubOptionTags.map(tag => tag.name));
    done();
  });
});
