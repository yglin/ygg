import { range } from 'lodash';
import { v4 as uuid } from 'uuid';
import { TestBed } from '@angular/core/testing';

import { PlayTagService } from './play-tag.service';
import { PlayTag } from './play-tag';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { DataAccessService } from '@ygg/shared/infra/data-access';

const tagsInDB: PlayTag[] = range(10).map(() => PlayTag.forge());
const newTags: PlayTag[] = range(3).map(() => new PlayTag(uuid()));

@Injectable()
class MockDataAccessService {
  list$(...args) {}
  upsert(...args) {}
}

describe('PlayTagService', () => {
  let service: PlayTagService;
  let mockDataAccessService: MockDataAccessService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: DataAccessService, useClass: MockDataAccessService }
      ]
    })
  );

  beforeEach(() => {
    service = TestBed.get(PlayTagService);
    mockDataAccessService = TestBed.get(DataAccessService);
  });

  it('upsertList(): should only upsert new tags, which not in database', async done => {
    const whatReallyUpserted: PlayTag[] = [];
    jest
      .spyOn(mockDataAccessService, 'list$')
      .mockImplementation(() => of(tagsInDB));
    jest
      .spyOn(mockDataAccessService, 'upsert')
      .mockImplementation(
        (collection: string, playTag: PlayTag, constructor: any) => {
          whatReallyUpserted.push(playTag);
          return Promise.resolve();
        }
      );
    const tags = tagsInDB.concat(newTags);
    await service.upsertList(tags);
    expect(whatReallyUpserted).toEqual(newTags);
    done();
  });
});
