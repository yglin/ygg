import 'hammerjs';
import { range, random, remove } from 'lodash';
import { v4 as uuid } from 'uuid';
import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { ChipsControlComponent } from './chips-control.component';
import { Component, DebugElement } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { By } from '@angular/platform-browser';
import {
  ChipsControlComponentPageObject,
  selectorsConfig
} from './chips-control.component.po';

function forgeChips(): string[] {
  return range(random(2, 5)).map(() => uuid());
}

describe('ChipsControlComponent as Reactive Form Controller(ControlValueAccessor)', () => {
  @Component({
    selector: 'ygg-welcome-to-my-form',
    template:
      '<form [formGroup]="formGroup"><ygg-chips-control formControlName="chips"></ygg-chips-control></form>',
    styles: ['']
  })
  class MockFormComponent {
    formGroup: FormGroup;
    label: string;
    constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({
        chips: []
      });
    }
  }

  let formComponent: MockFormComponent;
  let component: ChipsControlComponent;
  let debugElement: DebugElement;
  let pageObject: ChipsControlComponentPageObject<ChipsControlComponent>;
  let fixture: ComponentFixture<MockFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      declarations: [MockFormComponent, ChipsControlComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    debugElement = fixture.debugElement;
    formComponent = fixture.componentInstance;
    component = debugElement.query(By.directive(ChipsControlComponent))
      .componentInstance;
    pageObject = new ChipsControlComponentPageObject('', selectorsConfig, {
      fixture,
      debugElement
    });
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    fixture.detectChanges();
  });

  it('should read value from parent form', async done => {
    const testChips = forgeChips();
    formComponent.formGroup.get('chips').setValue(testChips);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(Array.from(component.chips)).toEqual(testChips);
    done();
  });


  it('should output changed value to parent form', async done => {
    const testChips = forgeChips();
    component.emitChange(testChips);
    await fixture.whenStable();
    fixture.detectChanges();
    const chips = formComponent.formGroup.get('chips').value;
    expect(chips).toEqual(testChips);
    done();
  });

  it('should be able to clear all chips', async done => {
    component.chips = forgeChips();
    // const buttonClearAll = debugElement.query(By.css('.chips-control button#clear-all')).nativeElement;
    await pageObject.clearAll();
    // buttonClearAll.click();
    // await fixture.whenStable();
    // fixture.detectChanges();
    const chips = formComponent.formGroup.get('chips').value;
    expect(chips).toHaveLength(0);
    done();
  });

  it('can add chips by input names', async done => {
    await pageObject.clearAll();
    const testChips = forgeChips();
    for (const chip of testChips) {
      await pageObject.addChip(chip);
    }
    const chips = formComponent.formGroup.get('chips').value;
    expect(chips).toEqual(testChips);
    done();
  });


  it('chip should be unique, adding duplicates results to only one', async done => {
    await pageObject.clearAll();
    const testChip = 'yygg';
    await pageObject.addChip(testChip);
    await pageObject.addChip(testChip);
    await pageObject.addChip(testChip);
    const chips = formComponent.formGroup.get('chips').value;
    expect(chips).toEqual([testChip]);
    done();
  });

  it('can remove a single chip', async done => {
    const testChips = forgeChips();
    const testChip = 'yygg';
    testChips.push(testChip);
    component.chips = testChips;
    await fixture.whenStable();
    fixture.detectChanges();

    await pageObject.removeChip(testChip);
    // const deleteButton = debugElement.query(By.css('.chips-control .chip[chipName="yygg"] .delete')).nativeElement;
    // deleteButton.click();
    // await fixture.whenStable();
    // fixture.detectChanges();

    remove(testChips, chip => chip === testChip);
    const chips = formComponent.formGroup.get('chips').value;
    expect(chips).toEqual(testChips);
    done();
  });

  it('show autocomplete dropdown after typed 2 letters, and show filtered option chips', async done => {
    jest.setTimeout(10000);
    const autocompleteOptions = [
      'APPLE',
      'BANANA',
      'ORANGE',
      'MONGO',
      'MONKEY'
    ];
    component.autocompleteOptions = autocompleteOptions;
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();

    await pageObject.clearInput();
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    await pageObject.typeIntoInput('A');
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    await pageObject.typeIntoInput('P');
    expect(component.isDisplayAutocompleteSelector).toBe(true);
    pageObject.expectAutoCompleteOptions(['APPLE']);
    await pageObject.clearInput();
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    await pageObject.typeIntoInput('M');
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    await pageObject.typeIntoInput('O');
    expect(component.isDisplayAutocompleteSelector).toBe(true);
    pageObject.expectAutoCompleteOptions(['MONGO', 'MONKEY']);
    await pageObject.clearInput();
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    await pageObject.typeIntoInput('G');
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    await pageObject.typeIntoInput('Y');
    expect(component.isDisplayAutocompleteSelector).toBe(false);
    done();
  });

});
