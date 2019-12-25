import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
// import { environment } from '../environments/environment';
//@ts-ignore
import { default as FIREBASE_CONFIG } from '@ygg/firebase/project-config.json';

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ]
})
export class SharedInfraDataAccessModule {}
