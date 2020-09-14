import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { getEnv } from '@ygg/shared/infra/core';


@NgModule({
  imports: [
    CommonModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(getEnv('firebase'))
  ]
})
export class TagsDataAccessModule {}
