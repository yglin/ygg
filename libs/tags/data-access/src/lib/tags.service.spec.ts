import { TestBed } from '@angular/core/testing';
import { TagsService } from './tags.service';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { LogService } from '@ygg/shared/infra/log';

describe('TagService', () => {
  @Injectable()
  class MockAngularFirestore {
    collection<T>(name: string) {
      return {
        valueChanges: () => of([])
      };
    }
  }

  @Injectable()
  class MockAngularFireDatabase {
    object<T>(path) {
      return {
        valueChanges: () => of({})
      };
    }
  }

  @Injectable()
  class MockLogService {}

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useClass: MockAngularFirestore },
        { provide: AngularFireDatabase, useClass: MockAngularFireDatabase },
        { provide: LogService, useClass: MockLogService }
      ]
    })
  );

  it('should be created', () => {
    const service: TagsService = TestBed.get(TagsService);
    expect(service).toBeTruthy();
  });
});
