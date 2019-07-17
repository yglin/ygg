import { range, remove } from 'lodash';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayTagsInputComponent } from './play-tags-input.component';
import {
  Component,
  DebugElement,
  Injectable,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SharedTypesModule, Tag } from '@ygg/shared/types';
import { PlayAdminService } from '../../admin/play-admin.service';
import { PlayTag } from '../play-tag';
import { of, Observable } from 'rxjs';
import { PlayTagService } from '../play-tag.service';

const stubPlayTags = range(13).map(() => PlayTag.forge());

@Injectable()
class MockPlayAdminService {
  getPlayTags$() {
    return of(stubPlayTags);
  }
}

@Injectable()
class MockPlayTagService {
  upsertList() {
    return Promise.resolve();
  }
}

@Component({
  selector: 'ygg-tags-input',
  template: ``,
  styles: [``]
})
class MockTagsInputComponent implements OnInit {
  @Input() label: string;
  @Input() tagsSource$: Observable<Tag[]>;
  @Input() tags: Tag[] = [];
  @Output() changed: EventEmitter<Tag[]> = new EventEmitter();

  tagsSource: Tag[];

  ngOnInit() {
    if (this.tagsSource$) {
      this.tagsSource$.subscribe(tagsSource => (this.tagsSource = tagsSource));
    }
  }

  addTag(name) {
    this.tags.push(new Tag(name));
    this.changed.emit(this.tags);
  }

  removeTag(name) {
    remove(this.tags, tag => tag.name === name);
    this.changed.emit(this.tags);
  }
}

describe('PlayTagInputComponent, used as Reactive Form Controller', () => {
  @Component({
    selector: 'test-parent-form',
    template: `
      <form [formGroup]="formGroup">
        <ygg-play-tags-input formControlName="tags"></ygg-play-tags-input>
      </form>
    `,
    styles: [``]
  })
  class TestParentFormComponent {
    formGroup: FormGroup;
    constructor(private formBuilder: FormBuilder) {
      this.formGroup = this.formBuilder.group({
        tags: []
      });
    }
  }

  let component: TestParentFormComponent;
  let fixture: ComponentFixture<TestParentFormComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayTagsInputComponent,
        TestParentFormComponent,
        MockTagsInputComponent
      ],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        { provide: PlayAdminService, useClass: MockPlayAdminService },
        { provide: PlayTagService, useClass: MockPlayTagService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestParentFormComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should implement ControlValueAccessor, to be used as Reactive form controller', async done => {
    const formControl = component.formGroup.get('tags');
    const mockTagsInputComponent: MockTagsInputComponent = debugElement.query(
      By.directive(MockTagsInputComponent)
    ).componentInstance;

    const newTags = ['YG is really a GY', 'And an Asshole'];
    // Add first tag
    mockTagsInputComponent.addTag(newTags[0]);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(formControl.value).toEqual([newTags[0]]);

    // Add second tag
    mockTagsInputComponent.addTag(newTags[1]);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(formControl.value).toEqual(newTags);

    // Remove first tag
    mockTagsInputComponent.removeTag(newTags[0]);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(formControl.value).toEqual([newTags[1]]);

    done();
  });
});

describe('PlayTagsInputComponent', () => {
  let component: PlayTagsInputComponent;
  let fixture: ComponentFixture<PlayTagsInputComponent>;
  let debugElement: DebugElement;
  let mockPlayAdminService: MockPlayAdminService;
  let mockPlayTagService: MockPlayTagService;
  let mockTagsInputComponent: MockTagsInputComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayTagsInputComponent, MockTagsInputComponent],
      providers: [
        { provide: PlayAdminService, useClass: MockPlayAdminService },
        { provide: PlayTagService, useClass: MockPlayTagService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayTagsInputComponent);
    component = fixture.componentInstance;
    mockPlayAdminService = TestBed.get(PlayAdminService);
    mockPlayTagService = TestBed.get(PlayTagService);
    debugElement = fixture.debugElement;
    mockTagsInputComponent = debugElement.query(
      By.directive(MockTagsInputComponent)
    ).componentInstance;
  });

  it('should fetch preset play tags anf pass to tags-input', () => {
    jest
      .spyOn(mockPlayAdminService, 'getPlayTags$')
      .mockImplementation(() => of(stubPlayTags));
    // ngOnInit()
    fixture.detectChanges();
    expect(mockPlayAdminService.getPlayTags$).toHaveBeenCalled();
    expect(mockTagsInputComponent.tagsSource).toBe(stubPlayTags);
  });

  it('should be able to call PlayTagService.upsertList', async done => {
    jest.spyOn(mockPlayTagService, 'upsertList');
    await component.upsertTags();
    expect(mockPlayTagService.upsertList).toHaveBeenCalled();
    done();
  });
});
