import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
// import { environment } from '../environments/environment';
//@ts-ignore
import { default as FIREBASE_CONFIG } from '@ygg/firebase/project-config.json';

let useLocalEmulators = false;
let firestoreEmulatorHost: string;
let experimentalForceLongPolling = false;

try {
  const FirebaseJSON = require('firebase.json');
  firestoreEmulatorHost = `localhost:${FirebaseJSON.emulators.firestore.port}`;
  useLocalEmulators = window.location.hostname.startsWith('localhost');
  experimentalForceLongPolling = 'Cypress' in window;
  if (useLocalEmulators) {
    console.log(`Use Firebase Emulators...`);
    console.log(`Firestore Emulator Host: ${firestoreEmulatorHost}`);
    console.log(
      `Due to issue https://github.com/cypress-io/cypress/issues/6350, set experimentalForceLongPolling = ${experimentalForceLongPolling}`
    );
  }
} catch (error) {
  console.error(
    `Failed to use Firebase Emulators, error message:\n ${error.message}`
  );
}

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [
    // {
    //   provide: SETTINGS,
    //   useValue: {
    //     host: 'localhost:8080',
    //     ssl: false,
    //     experimentalForceLongPolling: true
    //   }
    // }
    {
      provide: SETTINGS,
      useValue: useLocalEmulators
        ? {
            host: firestoreEmulatorHost,
            ssl: false,
            experimentalForceLongPolling
          }
        : undefined
    }
  ]
})
export class SharedInfraDataAccessModule {}
