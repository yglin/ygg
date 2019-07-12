import { sampleSize, xor } from 'lodash';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tags } from '@ygg/shared/types';
import { AdminResourceTagsComponent } from './admin-resource-tags.component';
import { DebugElement, Injectable } from '@angular/core';
// import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ResourceTagService } from '../../tag/resource-tag.service';
import { ResourceAdminService } from '../resource-admin.service';

describe('AdminResourceTagsComponent', () => {
  let component: AdminResourceTagsComponent;
  let fixture: ComponentFixture<AdminResourceTagsComponent>;
  let mockResourceTagsService: MockResourceTagsService;
  let mockResourceAdminService: MockResourceAdminService;
  let debugElement: DebugElement;
  let tagsAll: Tags;
  let tagsSelected: Tags;

  @Injectable()
  class MockResourceTagsService {
    list$() {
      return of(tagsAll);
    }
  }

  @Injectable()
  class MockResourceAdminService {
    getData$() {
      return of(tagsSelected);
    }

    async setData() {
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
      declarations: [AdminResourceTagsComponent],
      providers: [
        { provide: ResourceTagService, useClass: MockResourceTagsService },
        { provide: ResourceAdminService, useClass: MockResourceAdminService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminResourceTagsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    mockResourceTagsService = TestBed.get(ResourceTagService);
    mockResourceAdminService = TestBed.get(ResourceAdminService);
  });

  it('should fetch all and selected tags', () => {
    jest.spyOn(mockResourceTagsService, 'list$');
    jest.spyOn(mockResourceAdminService, 'getData$');
    // ngOnInit()
    fixture.detectChanges();
    expect(mockResourceTagsService.list$).toHaveBeenCalled();
    expect(mockResourceAdminService.getData$).toHaveBeenCalledWith('tags');
    expect(component.selectedTags).toEqual(tagsSelected.values);
    expect(component.unselectedTags).toEqual(xor(tagsAll.values, tagsSelected.values));
  });

  it('should onSubmit() update selected tags', async done => {
    // ngOnInit()
    fixture.detectChanges();
    jest.spyOn(mockResourceAdminService, 'setData');
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    const selected = new Tags(sampleSize(tagsAll.values, 5));
    await component.submit(selected);
    expect(mockResourceAdminService.setData).toHaveBeenCalled('tags', selected);
    done();  
  });
  
});
