import * as admin from 'firebase-admin';
import { EmceeFunctions } from './lib/emcee';
import { DataAccessorFunctions } from './lib/data-accessor';
import { RouterFunctions } from './lib/router';
admin.initializeApp();

export const emcee = new EmceeFunctions();
export const dataAccessor = new DataAccessorFunctions();
export const router = new RouterFunctions();