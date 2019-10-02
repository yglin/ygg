import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag, TaggableType } from '@ygg/tags/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { AngularFirestore } from '@angular/fire/firestore';
import { get, isArray } from 'lodash';
import { map, tap, shareReplay, catchError } from 'rxjs/operators';
import { TagsFeatureConfig } from './tags-config';
import { AngularFireDatabase } from '@angular/fire/database';
import { LogService } from '@ygg/shared/infra/log';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  tags$: Observable<Tag[]>;
  configs$: Observable<TagsFeatureConfig>;
  configPath = 'site-config/tags';

  constructor(
    private firestore: AngularFirestore,
    private fireRealDB: AngularFireDatabase,
    private logService: LogService
  ) {
    this.tags$ = this.firestore
      .collection<Tag>(Tag.collectionName)
      .valueChanges()
      .pipe(map(tags => tags.map(tag => new Tag(tag))));
    this.configs$ = this.fireRealDB
      .object<TagsFeatureConfig>(this.configPath)
      .valueChanges().pipe(shareReplay());
  }

  async setConfig$(path: string = '', data: any) {
    path = `${this.configPath}/${path.replace('.', '/')}`;
    return this.fireRealDB.object(path).set(data);
  }

  getConfig$<T>(path: string = ''): Observable<T> {
    path = path.replace('/', '.');
    return this.configs$.pipe(
      // tap(config => {
      //   console.log(`Get path ${path} in config data:`);
      //   console.log(config);
      // }),
      map(config => get(config, path)),
      // tap(data => {console.log('Received data:');console.log(data);})
    );
  }

  async upsertOne(tag: Tag) {
    return this.firestore
      .collection<Tag>(Tag.collectionName)
      .doc(tag.id)
      .set(tag.toJSON());
  }

  async upsert(tags: Tag[]) {
    const promises = [];
    for (const tag of tags) {
      promises.push(this.upsertOne(tag));
    }
    return Promise.all(promises);
  }

  async deleteOne(tag: Tag) {
    return this.firestore
      .collection<Tag>(Tag.collectionName)
      .doc(tag.id)
      .delete();
  }

  async delete(tags: Tag[]) {
    const promises = [];
    for (const tag of tags) {
      promises.push(this.deleteOne(tag));
    }
    return Promise.all(promises);
  }

  async setOptionTags$(taggableType: TaggableType, userOptionTags: Tag[]) {
    const path = `user-options/${taggableType.id}`;
    return this.setConfig$(path, userOptionTags.map(tag => tag.toJSON()));
  }

  getOptionTags$(taggableType: TaggableType): Observable<Tag[]> {
    const path = `user-options/${taggableType.id}`;
    // console.log(`Get option tags for type ${taggableTypeId}`);
    return this.getConfig$<Tag[]>(path).pipe(
      map(tagsData => {
        if (isArray(tagsData)) {
          return tagsData.map(tagData => Tag.fromJSON(tagData));
        } else {
          return [];
        }
      }),
      // tap(tags => console.log(`Fetched tags: ${tags}`)),
      catchError((error, caught) => {
        error.message = `Can not find user-options tags of type ${taggableType.id}, error detail:\n${error.message}`;
        this.logService.error(error);
        return [];
      })
    );
  }

  getTaggableTypes$(): Observable<TaggableType[]> {
    const path = 'taggable-types';
    return this.getConfig$<TaggableType[]>(path);
  }
}
