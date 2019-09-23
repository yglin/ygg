import { TestBed } from '@angular/core/testing';
import { TagService } from './tag.service';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PlaywhatAdminService } from '@ygg/playwhat/admin';
import { Tags } from './tags';

describe('TagService', () => {
  
  @Injectable()
  class MockPlaywhatAdminService {
    getData$<T>(path: string): Observable<T> {
      return of(null);
    }
  }

  let mockPlaywhatAdminService: MockPlaywhatAdminService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: PlaywhatAdminService, useClass: MockPlaywhatAdminService}
    ]
  }));

  beforeEach(() => {
    mockPlaywhatAdminService = TestBed.get(PlaywhatAdminService);
  });

  // it('should be created', () => {
  //   const service: TagService = TestBed.get(TagService);
  //   expect(service).toBeTruthy();
  // });

  it('getOptionTags$() should call PlaywhatAdminService.getData$ with path="tags/user-options/${taggableType}"', async done => {
    const stubTagsData = Tags.forge().toJSON();
    jest.spyOn(mockPlaywhatAdminService, 'getData$').mockImplementation(() => of(stubTagsData));
    const service: TagService = TestBed.get(TagService);
    const taggableType = 'garbage';
    service.getOptionTags$(taggableType).subscribe(tags => {
      expect(mockPlaywhatAdminService.getData$).toHaveBeenCalledWith(`tags/user-options/${taggableType}`);
      expect(tags.toJSON()).toEqual(stubTagsData);
      done();
    });
  });
  
});
