import 'hammerjs';
import { omit } from 'lodash';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayFormComponent } from './play-form.component';
import { DebugElement, Injectable } from '@angular/core';
// import { isDisabled, PageObject } from '@ygg/shared/infra/test-utils';
import { Play } from '../play';
import { hasValidator, FormControlType } from '@ygg/shared/types';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlayService } from '../play.service';
import { LogService } from '@ygg/shared/infra/log';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUiNavigationModule } from '@ygg/shared/ui/navigation';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { MockComponent } from "ng-mocks";
import { PlayViewComponent } from '../play-view/play-view.component';
import { TagsUiModule } from '@ygg/tags/ui';
import { By } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

describe('PlayFormComponent', () => {
  @Injectable()
  class MockLogService {}

  @Injectable()
  class MockPlayService {
    async upsert(play: Play) {};
  }

  @Injectable()
  class MockRouter {
    navigate() {}
  }

  @Injectable()
  class MockActivatedRoute {
    parent = null;
  }

  let component: PlayFormComponent;
  let fixture: ComponentFixture<PlayFormComponent>;
  let debugElement: DebugElement;
  let mockPlayService: MockPlayService;

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
      declarations: [PlayFormComponent, MockComponent(PlayViewComponent)],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        // RouterTestingModule.withRoutes([]),
        SharedUiWidgetsModule,
        SharedUiNgMaterialModule,
        SharedTypesModule,
        TagsUiModule
      ],
      providers: [
        { provide: PlayService, useClass: MockPlayService },
        { provide: LogService, useClass: MockLogService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayFormComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    mockPlayService = TestBed.get(PlayService);
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    fixture.detectChanges();
  });

  it('Fields "name" and "introduction" should be required', async done => {
    expect(component.formGroup.invalid).toBe(true);

    const nameControl = component.formGroup.get('name');
    nameControl.setValue(null);
    nameControl.markAsTouched();
    expect(nameControl.hasError('required')).toBe(true);

    const introductionControl = component.formGroup.get('introduction');
    introductionControl.setValue(null);
    introductionControl.markAsTouched();
    expect(introductionControl.hasError('required')).toBe(true);

    nameControl.setValue('ggyy');
    introductionControl.setValue('this is ggyy');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.formGroup.valid).toBe(true);
    done();
  });

  it('Should submit consistent data', async done => {
    jest.spyOn(mockPlayService, 'upsert').mockImplementation(async play => {
      expect(omit(play.toJSON(), ['id'])).toEqual(omit(testPlay.toJSON(), ['id']));
      done();
    });
    component.formGroup.patchValue(testPlay);
    component.onSubmit();
  });
});
