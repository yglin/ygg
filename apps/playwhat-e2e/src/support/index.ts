// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

/**
 * 2019/08/01 yglin.mlanser@gmail.com
 * Have to import "reflect-metadata" to the begining typescript compilation
 * Otherwise it throws below error whenever some external class from shared library imported, and used.
 * TypeError: Reflect.defineMetadata is not a function
 */
import 'reflect-metadata';

// Import commands.js using ES2015 syntax:
import './commands';
