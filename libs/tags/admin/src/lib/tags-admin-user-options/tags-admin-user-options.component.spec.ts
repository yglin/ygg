import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagsAdminUserOptionsComponent } from './tags-admin-user-options.component';
import { Injectable } from '@angular/core';
import { sampleSize, random } from 'lodash';
import { Observable, of } from 'rxjs';
import { Tag, Tags, TaggableType } from '@ygg/tags/core';
import { AngularJestTester } from '@ygg/shared/test/angular-jest';
import { TagsAdminUserOptionsPageObject } from './tags-admin-user-options.component.po';
import { TagsAdminService } from '../tags-admin.service';
import { TagsService } from '@ygg/tags/data-access';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { LogService } from '@ygg/shared/infra/log';

class TagsAdminUserOptionsPageObjectAngularJest extends TagsAdminUserOptionsPageObject {
  tester: AngularJestTester;
  constructor(parentSelector: string, tester: AngularJestTester) {
    super(parentSelector);
    this.tester = tester;
  }

  async searchTag(tag: Tag) {
    return this.tester.inputText(this.getSelector('inputSearch'), tag.name);
  }

  async expectTaggableTypes(taggableTypes: TaggableType[]) {
    for (const taggableType of taggableTypes) {
      this.tester.expectExist(
        this.getSelectorForTaggableTypeOption(taggableType),
        true
      );
    }
  }

  async selectTaggableType(taggableType: TaggableType) {
    return this.tester.inputSelect(
      this.getSelector('taggableTypeSelector'),
      taggableType.id
    );
  }

  async selectTags(tags: Tag[]) {
    for (const tag of tags) {
      await this.tester.click(this.getSelectorForTag(tag));
    }
    return Promise.resolve();
  }

  async selectUserOptionTags(tags: Tag[]) {
    for (const tag of tags) {
      await this.tester.click(this.getSelectorForUserOptionTag(tag));
    }
    return Promise.resolve();
  }

  async expectUserOptionTags(tags: Tag[]) {
    for (const tag of tags) {
      this.tester.expectVisible(this.getSelectorForUserOptionTag(tag), true);
    }
    return Promise.resolve();
  }

  async addSelectedToUserOptionTags() {
    return this.tester.click(this.getSelector('buttonAddToUserOptionTags'));
  }

  async expectTags(tags: Tag[]) {
    for (const tag of tags) {
      this.tester.expectVisible(this.getSelectorForTag(tag), true);
    }
    return Promise.resolve();
  }

  async expectNotTags(tags: Tag[]) {
    for (const tag of tags) {
      this.tester.expectVisible(this.getSelectorForTag(tag), false);
    }
    return Promise.resolve();
  }

  async expectTagsAll(tags: Tag[]) {
    const count = this.tester.countElements(
      `${this.getSelector('tagInTagsAll')}`
    );
    expect(count).toBe(tags.length);
    for (const tag of tags) {
      this.tester.expectVisible(this.getSelectorForTag(tag), true);
    }
    return Promise.resolve();
  }

  async removeSelectedFromUserOptionTags() {
    return this.tester.click(this.getSelector('buttonRemoveUserOptionTags'));
  }

  async saveUserOptionTags() {
    this.tester.stubConfirm();
    this.tester.stubAlert();
    return this.tester.click(this.getSelector('buttonSaveUserOptionTags'));
  }
}

describe('TagsAdminUserOptionsComponent', () => {
  const stubTagsAll = Tags.forge().toTagsArray();
  const stubTaggableTypes: TaggableType[] = [
    {
      id: 'ggyy',
      label: 'GGYY',
      collection: 'ggyys'
    },
    {
      id: 'garbagy',
      label: '垃圾GY',
      collection: 'garbages'
    }
  ];
  const stubUserOptionTags = sampleSize(
    stubTagsAll,
    random(1, stubTagsAll.length - 1)
  );

  // @Injectable()
  // class MockLogService {
  //   error(message: string) {}
  // }

  @Injectable()
  class MockTagsService {
    tags$: Observable<Tag[]> = of(stubTagsAll);
    getTaggableTypes$(): Observable<TaggableType[]> {
      return of(stubTaggableTypes);
    }
    getOptionTags$(): Observable<Tag[]> {
      return of(stubUserOptionTags);
    }
  }

  @Injectable()
  class MockTagsAdminService {
    async saveUserOptionTags(
      taggableType: TaggableType,
      userOptionTags: Tag[]
    ) {}
  }

  let component: TagsAdminUserOptionsComponent;
  let fixture: ComponentFixture<TagsAdminUserOptionsComponent>;
  let mockTagsService: MockTagsService;
  let mockTagsAdminService: MockTagsAdminService;
  let pageObject: TagsAdminUserOptionsPageObject;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagsAdminUserOptionsComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedUiNgMaterialModule,
        SharedUiWidgetsModule,
        FlexLayoutModule
      ],
      providers: [
        // { provide: LogService, useClass: MockLogService },
        { provide: TagsService, useClass: MockTagsService },
        { provide: TagsAdminService, useClass: MockTagsAdminService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsAdminUserOptionsComponent);
    component = fixture.componentInstance;
    mockTagsService = TestBed.get(TagsService);
    mockTagsAdminService = TestBed.get(TagsAdminService);
    pageObject = new TagsAdminUserOptionsPageObjectAngularJest(
      '',
      new AngularJestTester({
        fixture: fixture,
        debugElement: fixture.debugElement
      })
    );
    fixture.detectChanges();
  });

  it('should fetch all tags on init', async done => {
    pageObject.expectTagsAll(stubTagsAll);
    done();
  });

  it('should fetch taggable types', async done => {
    await fixture.whenStable();
    fixture.detectChanges();
    pageObject.expectTaggableTypes(stubTaggableTypes);
    done();
  });

  it('should fetch user-options tags according to selected taggable type', async done => {
    await pageObject.selectTaggableType(stubTaggableTypes[0]);
    await pageObject.expectUserOptionTags(stubUserOptionTags);
    done();
  });

  it('should be able to search/filter tags by keyword', async done => {
    const targetTag = stubTagsAll[0];
    await pageObject.searchTag(targetTag);
    await pageObject.expectTagsAll([targetTag]);
    done();
  });

  it('should be able to add tags to user-options group', async done => {
    // Clear user-options group first
    stubUserOptionTags.length = 0;
    component.ngOnInit();
    const targetTags = stubTagsAll.slice(0, 2);
    await pageObject.selectTags(targetTags);
    await pageObject.addSelectedToUserOptionTags();
    await pageObject.expectUserOptionTags(targetTags);
    done();
  });

  it('should be able to remove tags from user-options group', async done => {
    await pageObject.selectUserOptionTags(stubUserOptionTags);
    await pageObject.removeSelectedFromUserOptionTags();
    await pageObject.expectUserOptionTags([]);
    done();
  });

  it('should be able to save tags in user-options group', async done => {
    jest.spyOn(mockTagsAdminService, 'saveUserOptionTags');
    await pageObject.selectTaggableType(stubTaggableTypes[0]);
    await pageObject.saveUserOptionTags();
    expect(mockTagsAdminService.saveUserOptionTags).toHaveBeenCalledWith(
      stubTaggableTypes[0],
      stubUserOptionTags
    );
    done();
  });
});
