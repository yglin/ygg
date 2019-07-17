import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { v4 as uuid } from 'uuid';
import { range } from 'lodash';
import { TagsInputComponent } from './tags-input.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { of } from 'rxjs';
import { Tag } from '../tags';
import { take } from 'rxjs/operators';

describe('TagsInputComponent', () => {
  let component: TagsInputComponent;
  let fixture: ComponentFixture<TagsInputComponent>;
  let debugElement: DebugElement;
  let input: HTMLInputElement;
  const stubTagsSource = range(10).map(() => Tag.forge());
  const inputTags = range(3).map(() => Tag.forge());

  async function typein(letters: string) {
    input.value = letters;
    input.dispatchEvent(new KeyboardEvent('keyup'));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagsInputComponent],
      imports: [SharedUiNgMaterialModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsInputComponent);
    component = fixture.componentInstance;
    component.tagsSource$ = of(stubTagsSource);
    component.tags = inputTags;
    debugElement = fixture.debugElement;
    input = debugElement.query(By.css('input#add-tags')).nativeElement;
    fixture.detectChanges();
  });

  it('should display autocomplete selector only when user types over 2 letters, and got matched tags', async done => {
    // Initially the selector is hidden
    expect(component.isDisplayAutocompleteSelector).toBe(false);

    // Type in 1 letter, still hidden
    await typein('Y')
    expect(component.isDisplayAutocompleteSelector).toBe(false);

    // Type in 2 letters, matched, show up
    await typein(stubTagsSource[0].name.slice(0, 2));
    expect(component.isDisplayAutocompleteSelector).toBe(true);

    // Type in over 2 letters, not matched, hide
    await typein(uuid());
    expect(component.isDisplayAutocompleteSelector).toBe(false);

    // Another matched keyword, show up
    await typein(stubTagsSource[1].name);
    expect(component.isDisplayAutocompleteSelector).toBe(true);

    // Clear input, hide again
    await typein('');
    expect(component.isDisplayAutocompleteSelector).toBe(false);

    done();
  });

  it('should be able to add new tag to input tags, and emit change', () => {
    const newTag = new Tag(uuid());
    const expectTags = [...inputTags, newTag];
    jest.spyOn(component.changed, 'emit');
    component.addTag(newTag.name);
    expect(component.tags.map(tag => tag.name)).toEqual(expectTags.map(tag => tag.name));
    expect(component.changed.emit).toHaveBeenCalledWith(component.tags);
  });

  it('should filter out duplicated tag name when added', () => {
    const newTag = inputTags[0];
    jest.spyOn(component.changed, 'emit');
    component.addTag(newTag.name);
    expect(component.tags.map(tag => tag.name)).toEqual(inputTags.map(tag => tag.name));
  });

  it('should be able to remove tag, and emit change', () => {
    const removedTag = inputTags[0];
    const expectTags = inputTags.slice(1);
    jest.spyOn(component.changed, 'emit');
    component.removeTag(removedTag.name);
    expect(component.tags.map(tag => tag.name)).toEqual(expectTags.map(tag => tag.name));
    expect(component.changed.emit).toHaveBeenCalledWith(component.tags);
  });
  
});
