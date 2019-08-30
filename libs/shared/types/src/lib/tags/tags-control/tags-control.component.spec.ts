import 'hammerjs';
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { TagsControlComponent } from './tags-control.component';
import { Component, DebugElement } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { By } from '@angular/platform-browser';
import { Tags, Tag } from '../tags';
import { TagsControlComponentPageObject } from './tags-control.component.po';
import { AngularJestTester } from '@ygg/shared/infra/test-utils/jest';
import { BehaviorSubject } from 'rxjs';

describe('TagsControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
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
  let debugElement: DebugElement;
  let pageObject: TagsControlComponentPageObject;
  let fixture: ComponentFixture<MockFormComponent>;
  const autocompleteTagsSource: BehaviorSubject<Tags> = new BehaviorSubject(null);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [MockFormComponent, TagsControlComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(TagsControlComponent))
      .componentInstance;
    const tester = new AngularJestTester({
      fixture,
      debugElement
    });
    pageObject = new TagsControlComponentPageObject(tester, '');
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    component.autocompleteTags = autocompleteTagsSource;
    fixture.detectChanges();
  });

  it('should show @Input() label', async done => {
    formComponent.label = 'BaBaYGG';
    await fixture.whenStable();
    fixture.detectChanges();
    pageObject.expectTextContent('label', formComponent.label);
    done();
  });

  it('should read value from parent form', async done => {
    const testTags = Tags.forge();
    formComponent.formGroup.get('tags').setValue(testTags);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.tags.toJSON()).toEqual(testTags.toJSON());
    done();
  });

  it('should output changed value to parent form', async done => {
    const testTags = Tags.forge();
    component.clearTags();
    for (const name of testTags.getNames()) {
      component.addTag(name);
    }
    await fixture.whenStable();
    fixture.detectChanges();
    const tags: Tags = formComponent.formGroup.get('tags').value;
    expect(tags.toJSON()).toEqual(testTags.toJSON());
    done();
  });

  it('can clear all tags', async done => {
    component.tags = Tags.forge();
    await pageObject.clearAll();
    const result: Tags = formComponent.formGroup.get('tags').value;
    expect(result.toJSON()).toHaveLength(0);
    done();
  });

  it('can set tags by input name and add one by one', async done => {
    const testTags = Tags.forge();
    await pageObject.setValue(testTags);
    const result: Tags = formComponent.formGroup.get('tags').value;
    expect(result.toJSON()).toEqual(testTags.toJSON());
    done();
  });

  it('can remove a single tag', async done => {
    const testTags = Tags.forge();
    testTags.push(new Tag('GGYY'));
    component.tags = new Tags(testTags);
    await fixture.whenStable();
    fixture.detectChanges();
    await pageObject.removeTag('GGYY');
    testTags.remove('GGYY');
    const result: Tags = formComponent.formGroup.get('tags').value;
    expect(result.toJSON()).toEqual(testTags.toJSON());
    done();
  });

  it('show autocomplete dropdown after typed 2 letters, and show filtered option tags', async done => {
    jest.setTimeout(10000);
    const autocompleteTags = new Tags(['APPLE', 'BANANA', 'ORANGE', 'MONGO', 'MONKEY']);
    autocompleteTagsSource.next(autocompleteTags);
    await fixture.whenStable();
    fixture.detectChanges();

    await pageObject.clearInput();
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    await pageObject.typeIntoName('A');
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    await pageObject.typeIntoName('P');
    expect(component.isDisplayAutocompleteSelector).toBe(true);
    pageObject.expectAutoCompleteDropdownOptions(['APPLE']);
    await pageObject.clearInput();
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    await pageObject.typeIntoName('M');
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    await pageObject.typeIntoName('O');
    expect(component.isDisplayAutocompleteSelector).toBe(true);
    pageObject.expectAutoCompleteDropdownOptions(['MONGO', 'MONKEY']);
    await pageObject.clearInput();
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    await pageObject.typeIntoName('G');
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    await pageObject.typeIntoName('Y');
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    done();
  });
  
});
