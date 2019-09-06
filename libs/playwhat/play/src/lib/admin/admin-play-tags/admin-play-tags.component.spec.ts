import { sampleSize, uniqBy, xor, range, remove, find } from 'lodash';
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
// import { Tags } from '@ygg/shared/types';
import { MockComponent } from 'ng-mocks';
import { AdminPlayTagsComponent } from './admin-play-tags.component';
import { DebugElement, Injectable } from '@angular/core';
// import { By } from '@angular/platform-browser';
import { of, BehaviorSubject } from 'rxjs';
// import { PlayAdminService } from '../play-admin.service';
import { PlayTagService } from '../../tag/play-tag.service';
import { PlayAdminService } from '../play-admin.service';
import { PlayTag } from '../../tag/play-tag';
import { ItemsGroupSwitcherComponent } from '@ygg/shared/ui/widgets';
import { By } from '@angular/platform-browser';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { PageObject } from '@ygg/shared/infra/test-utils';
import { AdminPlayTagsPageObject } from './admin-play-tags.component.po';
import { AngularJestTester } from '@ygg/shared/infra/test-utils/jest';
import { Tags } from '@ygg/shared/types';

describe('AdminPlayTagsComponent', () => {
  const tagsAll: PlayTag[] = uniqBy(
    range(20).map(() => PlayTag.forge()),
    'name'
  );
  const tagsSelected: PlayTag[] = sampleSize(tagsAll, 5);
  const tagsUnselected: PlayTag[] = xor(tagsAll, tagsSelected);
  const newTagName = uuid();

  @Injectable()
  class MockPlayTagService {
    stubTagsAll$ = new BehaviorSubject<PlayTag[]>(tagsAll);
    playTags$ = of(tagsSelected);
    list$() {
      return this.stubTagsAll$;
    }

    upsert(tag: PlayTag): Promise<PlayTag> {
      tagsAll.push(tag);
      this.stubTagsAll$.next(tagsAll);
      return Promise.resolve(tag);
    }

    async deleteList(tags: PlayTag[]) {
      remove(tagsAll, tag => !!(find(tags, _tag => _tag.id === tag.id)));
      this.stubTagsAll$.next(tagsAll);
    }
  }

  @Injectable()
  class MockPlayAdminService {
    async setData() {
      return Promise.resolve();
    }
  }

  let component: AdminPlayTagsComponent;
  let fixture: ComponentFixture<AdminPlayTagsComponent>;
  let debugElement: DebugElement;
  let tester: AngularJestTester;
  let pageObject: AdminPlayTagsPageObject;
  // let mockPlayTagService: MockPlayTagService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminPlayTagsComponent,
        ItemsGroupSwitcherComponent
      ],
      imports: [FormsModule, ReactiveFormsModule, SharedUiNgMaterialModule],
      providers: [
        { provide: PlayTagService, useClass: MockPlayTagService },
        { provide: PlayAdminService, useClass: MockPlayAdminService }
      ]
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPlayTagsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    tester = new AngularJestTester({ fixture, debugElement });
    pageObject = new AdminPlayTagsPageObject(tester);
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    fixture.detectChanges();
  });

  it('should fetch all and selected tags', async done => {
    expect(JSON.stringify(component.selected)).toEqual(JSON.stringify(tagsSelected));
    expect(JSON.stringify(component.unselected)).toEqual(JSON.stringify(tagsUnselected));
    done();
  });

  it('should be able to add and remove PlayTag in unselected', async done => {
    const mockPlayTagService: MockPlayTagService = TestBed.get(PlayTagService);
    jest.spyOn(mockPlayTagService, 'upsert');
    await pageObject.addNewTag(newTagName);
    expect(mockPlayTagService.upsert).toHaveBeenCalled();
    await pageObject.expectTag(newTagName);
    await pageObject.removeTag(newTagName);
    await pageObject.expectNoTag(newTagName);
    done();
  });

  it('should call PlayAdminService.setData() to update selected tags', async done => {
    const mockPlayAdminService: MockPlayAdminService = TestBed.get(PlayAdminService);
    jest.spyOn(mockPlayAdminService, 'setData');
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    await pageObject.savePlayTags();
    expect(mockPlayAdminService.setData).toHaveBeenCalledWith('tags', component.selected.map(tag => tag.id));
    done();
  });
});
