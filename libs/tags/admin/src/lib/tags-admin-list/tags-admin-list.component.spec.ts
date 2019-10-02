import { remove, find } from 'lodash';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsAdminListComponent } from './tags-admin-list.component';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Tag, Tags } from '@ygg/tags/core';
import { TagsService } from '@ygg/tags/data-access';
import { AngularJestTester } from '@ygg/shared/test/angular-jest';
import { TagsAdminListPageObject } from './tags-admin-list.component.po';
import { TagsAdminService } from '../tags-admin.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { By } from '@angular/platform-browser';

class TagsAdminListPageObjectAngularJest extends TagsAdminListPageObject {
  tester: AngularJestTester;
  constructor(parentSelector: string, tester: AngularJestTester) {
    super(parentSelector);
    this.tester = tester;
  }

  async searchTag(tag: Tag) {
    return this.tester.inputText(this.getSelector('inputSearch'), tag.name);
  }

  async selectTags(tags: Tag[]) {
    for (const tag of tags) {
      await this.tester.click(this.getSelectorForTag(tag));
    }
    return Promise.resolve();
  }

  async createNewTag(tag: Tag) {
    this.tester.stubConfirm();
    await this.tester.inputText(this.getSelector('inputSearch'), tag.name);
    this.expectDisabled('buttonAddNewTag', false);
    return this.tester.click(this.getSelector('buttonAddNewTag'));
  }

  async removeSelectedTags() {
    this.tester.stubConfirm();
    return this.tester.click(this.getSelector('buttonRemoveSelected'))
  }

  async expectTags(tags: Tag[]) {
    // console.log(this.tester.debugElement.queryAll(By.css('.tags-admin-list .tag-item')).map(de => de.attributes));
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
    const count = this.tester.countElements(`${this.getSelector('tag')}`);
    expect(count).toBe(tags.length);
    for (const tag of tags) {
      this.tester.expectVisible(this.getSelectorForTag(tag), true);
    }
    return Promise.resolve();
  }

  expectDisabled(elementName: string, flag: boolean) {
    this.tester.expectDisabled(this.getSelector(elementName), flag);
  }
}

describe('TagsAdminListComponent', () => {
  const stubTagsAll = Tags.forge().toTagsArray();

  @Injectable()
  class MockTagsService {
    tags = stubTagsAll;
    tags$: BehaviorSubject<Tag[]> = new BehaviorSubject(this.tags);

    async upsert(tags: Tag[]) {
      this.tags.push(...tags);
      this.tags$.next(this.tags);
      return Promise.resolve();
    }

    async delete(tags: Tag[]) {
      remove(this.tags, tag => find(tags, _tag => _tag.id === tag.id));
      return Promise.resolve();
    }
  }

  @Injectable()
  class MockTagsAdminService {
    async saveUserOptionTags(taggableType: string, userOptionTags: Tag[]) {}
  }

  let component: TagsAdminListComponent;
  let fixture: ComponentFixture<TagsAdminListComponent>;
  let mockTagsService: MockTagsService;
  let mockTagsAdminService: MockTagsAdminService;
  let pageObject: TagsAdminListPageObject;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagsAdminListComponent],
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      providers: [
        { provide: TagsService, useClass: MockTagsService },
        { provide: TagsAdminService, useClass: MockTagsAdminService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsAdminListComponent);
    component = fixture.componentInstance;
    mockTagsService = TestBed.get(TagsService);
    mockTagsAdminService = TestBed.get(TagsAdminService);
    pageObject = new TagsAdminListPageObjectAngularJest(
      '',
      new AngularJestTester({
        fixture: fixture,
        debugElement: fixture.debugElement
      })
    );
    fixture.detectChanges();
  });

  it('should fetch all tags on init', async done => {
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
    await pageObject.expectTagsAll(stubTagsAll);
    done();
  });

  it('should enable add-new-tag button only when search out no result', async done => {
    pageObject.expectDisabled('buttonAddNewTag', true);
    await pageObject.searchTag(Tag.forge());
    pageObject.expectDisabled('buttonAddNewTag', false);
    done();
  });
  
  it('should be able to create new tags', async done => {
    jest.setTimeout(10000);
    jest.spyOn(mockTagsService, 'upsert');
    const newTags = Tags.forge().toTagsArray();
    // console.log(newTags);
    for (const newTag of newTags) {
      await pageObject.createNewTag(newTag);
    }
    await fixture.whenStable();
    fixture.detectChanges();
    expect(mockTagsService.upsert).toHaveBeenCalled();
    await pageObject.expectTags(newTags);
    done();
  });

  it('should be able to search/filter tags by keyword', async done => {
    const targetTag = stubTagsAll[0];
    await pageObject.searchTag(targetTag);
    await pageObject.expectTagsAll([targetTag]);
    done();
  });

  it('should enable delete button only when there are tags selected', async done => {
    pageObject.expectDisabled('buttonRemoveSelected', true);
    const targetTags = stubTagsAll.slice(0, 2);
    await pageObject.selectTags(targetTags);
    pageObject.expectDisabled('buttonRemoveSelected', false);
    done();
  });

  it('should be able to select and delete tags', async done => {
    jest.spyOn(mockTagsService, 'delete');
    const targetTags = stubTagsAll.slice(0, 2);
    await pageObject.selectTags(targetTags);
    await pageObject.removeSelectedTags();
    expect(mockTagsService.delete).toHaveBeenCalled();
    await pageObject.expectNotTags(targetTags);
    done();
  });
});
