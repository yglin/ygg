import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayFormComponent } from './play-form.component';
import { DebugElement, Injectable } from '@angular/core';
import { isDisabled, setInputValue } from '@ygg/shared/infra/test-utils';
import { Play } from '../play';
import { hasValidator, FormControlType } from '@ygg/shared/types';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlayService } from '../play.service';
import { LogService } from '@ygg/shared/infra/log';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUiNavigationModule } from '@ygg/shared/ui/navigation';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedTypesModule } from '@ygg/shared/types';

describe('PlayFormComponent', () => {
  @Injectable()
  class MockLogService {}

  @Injectable()
  class MockPlayService {}

  let component: PlayFormComponent;
  let fixture: ComponentFixture<PlayFormComponent>;
  let debugElement: DebugElement;

  const playFormModel = Play.getFormModel();
  const testPlay = Play.forge();

  beforeAll(function() {
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn()
      };
    });
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayFormComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        SharedUiWidgetsModule,
        SharedUiNgMaterialModule,
        SharedTypesModule
      ],
      providers: [
        { provide: PlayService, useClass: MockPlayService },
        { provide: LogService, useClass: MockLogService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayFormComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('Initially invalid and submit button disabled', () => {
    expect(component.formGroup.invalid).toBe(true);
    expect(isDisabled(debugElement, 'button#submit')).toBe(true);
  });

  it('After all required fields filled, form should turn valid and enable submit button', async done => {
    for (const name in playFormModel.controls) {
      if (playFormModel.controls.hasOwnProperty(name)) {
        const controlModel = playFormModel.controls[name];
        if (hasValidator(controlModel, 'required')) {
          // component.formGroup.get(name).setValue(testPlay[name]);
          setInputValue(debugElement, controlModel.type, name, testPlay[name]);
          // console.log(`Set value "${testPlay[name]}" to ${name}`);
        }
      }
    }
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.formGroup.valid).toBe(true);
    expect(isDisabled(debugElement, 'button#submit')).toBe(false);
    done();
  });
});
