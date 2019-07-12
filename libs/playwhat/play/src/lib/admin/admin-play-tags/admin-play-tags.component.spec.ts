import { sampleSize, xor } from 'lodash';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tags } from '@ygg/shared/types';
import { MockComponent } from "ng-mocks";
import { AdminPlayTagsComponent } from './admin-play-tags.component';
import { DebugElement, Injectable } from '@angular/core';
// import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
// import { PlayAdminService } from '../play-admin.service';
import { TagsGroupSwitchComponent } from '@ygg/shared/types';
import { PlayTagService } from '../../tag/play-tag.service';
import { PlayAdminService } from '../play-admin.service';

describe('AdminPlayTagsComponent', () => {
  let component: AdminPlayTagsComponent;
  let fixture: ComponentFixture<AdminPlayTagsComponent>;
  let debugElement: DebugElement;
  let tagsAll: Tags;
  let tagsSelected: Tags;

  @Injectable()
  class MockPlayTagService {
    listAllTagNames$() {
      return of(tagsAll);
    }
  }

  @Injectable()
  class MockPlayAdminService {
    getTags$() {
      return of(tagsSelected);
    }

    async setTags() {
      return Promise.resolve();
    }
  }

  beforeAll(() => {
    tagsAll = new Tags([
      'HAVE',
      'YOU',
      'EVER',
      'SEE',
      'THE',
      'RAIN',
      'YYGG',
      'BIRD',
      'BIRB',
      'BORB',
      'ORB',
      '口',
      '食道',
      '胃',
      '十二指腸',
      '小腸',
      '大腸',
      '盲腸',
      '直腸'
    ]);
    tagsSelected = new Tags(sampleSize(tagsAll.values, 5));
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPlayTagsComponent, MockComponent(TagsGroupSwitchComponent)],
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
    jest.spyOn(mockPlayTagService, 'listAllTagNames$');
    jest.spyOn(mockPlayAdminService, 'getTags$');
    // ngOnInit()
    fixture.detectChanges();
    expect(mockPlayTagService.listAllTagNames$).toHaveBeenCalled();
    expect(mockPlayAdminService.getTags$).toHaveBeenCalled();
    expect(component.selected.values).toEqual(tagsSelected.values);
    expect(component.unselected.values).toEqual(xor(tagsAll.values, tagsSelected.values));
  });

  it('should onSubmit() update selected tags', async done => {
    const mockPlayAdminService: MockPlayAdminService = TestBed.get(PlayAdminService);
    // ngOnInit()
    fixture.detectChanges();
    jest.spyOn(mockPlayAdminService, 'setTags');
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    const selected = new Tags(sampleSize(tagsAll.values, 5));
    await component.submit(selected);
    expect(mockPlayAdminService.setTags).toHaveBeenCalledWith(selected);
    done();  
  });
  
});
