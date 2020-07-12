import * as admin from 'firebase-admin';
import { EmceeFunctions } from './lib/emcee';
admin.initializeApp();

export const emcee = new EmceeFunctions();
