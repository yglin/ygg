import { DataAccessor, EntityAccessor } from '@ygg/shared/infra/core';
import { Observable } from 'rxjs';
import { RelationFactory, TheThing, RelationAccessor } from '@ygg/the-thing/core';
import { RelationBoxItem } from '../models';
import { switchMap } from 'rxjs/operators';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';

export const ItemCollection = 'items';

export class ItemAccessor extends EntityAccessor<TheThing> {
  collection = ItemCollection;
  serializer = TheThing.serializerJSON;
  deserializer = TheThing.deserializerJSON;

  constructor(
    protected relationAccessor: RelationAccessor,
    protected dataAccessor: DataAccessor
  ) {
    super(dataAccessor);
  }

  listItemsInBox$(boxId: string): Observable<TheThing[]> {
    return this.relationAccessor
      .findBySubjectAndRole$(boxId, RelationBoxItem.role)
      .pipe(
        switchMap(relationRecords =>
          this.listByIds$(
            relationRecords.map(rr => rr.objectId))
        )
      );
  }
}
