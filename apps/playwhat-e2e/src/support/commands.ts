// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
// import { attachCustomCommands } from 'cypress-firebase';

const fbConfig = {
  apiKey: "AIzaSyA0q0wCPnyx--wXaukOp6wPBRBj2L0pSAU",
  authDomain: "localhost-146909.firebaseapp.com",
  databaseURL: "https://localhost-146909.firebaseio.com",
  projectId: "localhost-146909",
  storageBucket: "localhost-146909.appspot.com",
  messagingSenderId: "102389786738"
};

firebase.initializeApp(fbConfig);

// attachCustomCommands({ Cypress, cy, firebase });

Cypress.Commands.add('login', () => {
  if (!Cypress.env('FIREBASE_AUTH_JWT')) {
    cy.log('FIREBASE_AUTH_JWT must be set to cypress environment in order to login');
  } else if (firebase.auth().currentUser) {
    cy.log('Authed user already exists, login complete.');
  } else {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(auth => {
        if (auth) {
          resolve(auth);
        }
      });
      firebase.auth().signInWithCustomToken(Cypress.env('FIREBASE_AUTH_JWT')).catch(reject);
    });
  }
});

Cypress.Commands.add('logout', () => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(auth => {
      if (!auth) {
        resolve();
      }
    });
    firebase.auth().signOut().catch(reject);
  });
});


