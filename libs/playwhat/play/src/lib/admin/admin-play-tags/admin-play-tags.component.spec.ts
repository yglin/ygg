import { sampleSize, xor, range, find } from 'lodash';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Tags } from '@ygg/shared/types';
import { MockComponent } from "ng-mocks";
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
import { FormsModule } from '@angular/forms';
import { v4 as uuid } from 'uuid';

describe('AdminPlayTagsComponent', () => {
  let component: AdminPlayTagsComponent;
  let fixture: ComponentFixture<AdminPlayTagsComponent>;
  let debugElement: DebugElement;
  const tagsAll: PlayTag[] = range(20).map(() => PlayTag.forge());
  const tagsSelected: PlayTag[] = sampleSize(tagsAll, 5);
  const newTagName = uuid();

  @Injectable()
  class MockPlayTagService {
    stubTagsAll = new BehaviorSubject<PlayTag[]>(tagsAll);
    list$() {
      return this.stubTagsAll;
    }

    upsert(tag: PlayTag): Promise<PlayTag> {
      tagsAll.push(tag);
      this.stubTagsAll.next(tagsAll);
      return Promise.resolve(tag);
    }
  }

  @Injectable()
  class MockPlayAdminService {
    getPlayTags$() {
      return of(tagsSelected);
    }

    async setPlayTags() {
      return Promise.resolve();
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPlayTagsComponent, MockComponent(ItemsGroupSwitcherComponent)],
      imports: [FormsModule, SharedUiNgMaterialModule],
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
  });

  it('should fetch all and selected tags', () => {
    const mockPlayTagService: MockPlayTagService = TestBed.get(PlayTagService);
    const mockPlayAdminService: MockPlayAdminService = TestBed.get(PlayAdminService);
    jest.spyOn(mockPlayTagService, 'list$');
    jest.spyOn(mockPlayAdminService, 'getPlayTags$');
    // ngOnInit()
    fixture.detectChanges();
    expect(mockPlayTagService.list$).toHaveBeenCalled();
    expect(mockPlayAdminService.getPlayTags$).toHaveBeenCalled();
    expect(component.selected).toEqual(tagsSelected);
    expect(component.unselected).toEqual(xor(tagsAll, tagsSelected));
  });

  it('should be able to add new PlayTag to unselected', async done => {
    const mockPlayTagService: MockPlayTagService = TestBed.get(PlayTagService);
    jest.spyOn(mockPlayTagService, 'upsert');
    const newTagInput: HTMLInputElement = debugElement.query(By.css('input#new-tag-name')).nativeElement;
    newTagInput.value = newTagName;
    await fixture.whenStable();
    fixture.detectChanges();
    const addNewTagButton = debugElement.query(By.css('button#add-new-tag')).nativeElement;
    addNewTagButton.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(mockPlayTagService.upsert).toHaveBeenCalled();
    expect(find(component.unselected, (tag) => tag.name === newTagName)).toBeDefined();
    done();
  });

  it('should onSubmit() update selected tags', async done => {
    const mockPlayAdminService: MockPlayAdminService = TestBed.get(PlayAdminService);
    // ngOnInit()
    fixture.detectChanges();
    jest.spyOn(mockPlayAdminService, 'setPlayTags');
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const selected = sampleSize(tagsAll, 7);
    await component.submit(selected);
    expect(mockPlayAdminService.setPlayTags).toHaveBeenCalledWith(selected);
    done();  
  });
  
});
