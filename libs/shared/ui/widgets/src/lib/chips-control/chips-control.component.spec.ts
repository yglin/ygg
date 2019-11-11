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
import { ChipsControlPageObject } from './chips-control.component.po';
import { AngularJestTester } from '@ygg/shared/test/angular-jest';

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
  let pageObject: ChipsControlPageObject;
  let angularJestTester: AngularJestTester;
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

    pageObject = new ChipsControlPageObject('');
    angularJestTester = new AngularJestTester({ fixture, debugElement });
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

  it('should only show add button when input more than 2 letters', async done => {
    await angularJestTester.inputText(pageObject.getSelector('inputChip'), '');
    angularJestTester.expectVisible(pageObject.getSelector('buttonAdd'), false);
    await angularJestTester.type(pageObject.getSelector('inputChip'), 'G');
    angularJestTester.expectVisible(pageObject.getSelector('buttonAdd'), false);
    await angularJestTester.type(pageObject.getSelector('inputChip'), 'Y');
    angularJestTester.expectVisible(pageObject.getSelector('buttonAdd'), true);
    done();
  });

  it('can add chips by input names', async done => {
    const testChips = forgeChips();
    for (const chip of testChips) {
      await angularJestTester.inputText(
        pageObject.getSelector('inputChip'),
        chip
      );
      await angularJestTester.click(pageObject.getSelector('buttonAdd'));
    }
    const chips = formComponent.formGroup.get('chips').value;
    expect(chips).toEqual(testChips);
    done();
  });

  it('should clear input after add', async done => {
    await angularJestTester.inputText(
      pageObject.getSelector('inputChip'),
      'GGYY'
    );
    await angularJestTester.click(pageObject.getSelector('buttonAdd'));
    angularJestTester.expectInputValue(
      pageObject.getSelector('inputChip'),
      ''
    );
    done();
  });

  it('can remove a single chip', async done => {
    const testChips = forgeChips();
    const testChip = 'yygg';
    testChips.push(testChip);
    component.chips = testChips;
    await fixture.whenStable();
    fixture.detectChanges();
    await angularJestTester.click(
      pageObject.getSelectorForChipDeleteButton(testChip)
    );
    remove(testChips, chip => chip === testChip);
    const chips = formComponent.formGroup.get('chips').value;
    expect(chips).toEqual(testChips);
    done();
  });

  it('should only show clear-all button when more than 2 chips', async done => {
    // Initially visible if given more than 2 chips
    formComponent.formGroup.get('chips').setValue(['ggyy', 'yygg']);
    await fixture.whenStable();
    fixture.detectChanges();    
    angularJestTester.expectVisible(
      pageObject.getSelector('buttonClear'),
      true
    );

    // Initially hidden if no chips
    formComponent.formGroup.get('chips').setValue([]);
    await fixture.whenStable();
    fixture.detectChanges();    
    angularJestTester.expectVisible(
      pageObject.getSelector('buttonClear'),
      false
    );
    
    // Add first chip, still hidden
    await angularJestTester.inputText(
      pageObject.getSelector('inputChip'),
      'GGYY'
    );
    await angularJestTester.click(pageObject.getSelector('buttonAdd'));
    angularJestTester.expectVisible(
      pageObject.getSelector('buttonClear'),
      false
    );
    
    // Add second chip, now show up
    await angularJestTester.inputText(
      pageObject.getSelector('inputChip'),
      'YYGG'
    );
    await angularJestTester.click(pageObject.getSelector('buttonAdd'));
    angularJestTester.expectVisible(
      pageObject.getSelector('buttonClear'),
      true
    );

    // Delete 1 chip, left 1 chip, hidden again
    await angularJestTester.click(
      pageObject.getSelectorForChipDeleteButton('GGYY')
    );
    angularJestTester.expectVisible(
      pageObject.getSelector('buttonClear'),
      false
    );

    done();
  });

  it('there should be button to clear all chips', async done => {
    component.chips = forgeChips();
    await angularJestTester.click(pageObject.getSelector('buttonClear'));
    const chips = formComponent.formGroup.get('chips').value;
    expect(chips).toHaveLength(0);
    done();
  });

  it('chip should be unique, adding duplicates results to only one', async done => {
    const testChip = 'yygg';
    await angularJestTester.inputText(
      pageObject.getSelector('inputChip'),
      testChip
    );
    await angularJestTester.click(pageObject.getSelector('buttonAdd'));
    await angularJestTester.inputText(
      pageObject.getSelector('inputChip'),
      testChip
    );
    await angularJestTester.click(pageObject.getSelector('buttonAdd'));
    const chips = formComponent.formGroup.get('chips').value;
    expect(chips).toEqual([testChip]);
    done();
  });

  it('show autocomplete dropdown after typed 2 letters, and show filtered option chips', async done => {
    function expectAutoCompleteOptions(values: string[]) {
      for (const value of values) {
        const optionSelector = `.autocomplete-panel [optionName="${value}"]`;
        angularJestTester.expectVisible(optionSelector, true);
      }
    }

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

    angularJestTester.expectVisible('.autocomplete-panel', false);
    await angularJestTester.type(pageObject.getSelector('inputChip'), 'A');
    angularJestTester.expectVisible('.autocomplete-panel', false);
    await angularJestTester.type(pageObject.getSelector('inputChip'), 'P');
    angularJestTester.expectVisible('.autocomplete-panel', true);
    expectAutoCompleteOptions(['APPLE']);
    await angularJestTester.inputText(pageObject.getSelector('inputChip'), '');
    angularJestTester.expectVisible('.autocomplete-panel', false);
    await angularJestTester.type(pageObject.getSelector('inputChip'), 'M');
    angularJestTester.expectVisible('.autocomplete-panel', false);
    await angularJestTester.type(pageObject.getSelector('inputChip'), 'O');
    angularJestTester.expectVisible('.autocomplete-panel', true);
    expectAutoCompleteOptions(['MONGO', 'MONKEY']);
    await angularJestTester.inputText(pageObject.getSelector('inputChip'), '');
    angularJestTester.expectVisible('.autocomplete-panel', false);
    await angularJestTester.type(pageObject.getSelector('inputChip'), 'G');
    angularJestTester.expectVisible('.autocomplete-panel', false);
    await angularJestTester.type(pageObject.getSelector('inputChip'), 'Y');
    angularJestTester.expectVisible('.autocomplete-panel', false);
    done();
  });
});
