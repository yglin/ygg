// Based on https://github.com/prescottprue/cypress-firebase
import { isObject, isBoolean } from 'lodash';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import * as fbConfig from '@ygg/firebase/project-config.develop.json';

// Constants
const FIREBASE_TOOLS_YES_ARGUMENT = '-y';
const FIREBASE_TOOLS_BASE_COMMAND = 'firebase';
const FIREBASE_EXTRA_PATH = '$(npm bin)/firebase-extra';

export function attachCustomCommands({ Cypress, cy, firebase }) {
  firebase.initializeApp(fbConfig);

  /**
   * Login to Firebase auth using FIREBASE_AUTH_JWT environment variable
   * which is generated using firebase-admin authenticated with serviceAccount
   * during test:buildConfig phase.
   * @type {Cypress.Command}
   * @name cy.login
   * @example
   * cy.login()
   */
  Cypress.Commands.add('login', () => {
    /** Log in using token * */
    if (!Cypress.env('FIREBASE_AUTH_JWT')) {
      cy.log(
        'FIREBASE_AUTH_JWT must be set to cypress environment in order to login'
      );
    } else {
      return new Promise((resolve, reject) => {
        if (firebase.auth().currentUser) {
          // cy.log('Authed user already exists, login complete.');
          resolve(firebase.auth().currentUser);
        } else {
          // eslint-disable-line consistent-return
          firebase.auth().onAuthStateChanged(auth => {
            if (auth) {
              resolve(auth);
            }
          });
          firebase
            .auth()
            .signInWithCustomToken(Cypress.env('FIREBASE_AUTH_JWT'))
            .catch(reject);
        }
      });
    }
  });

  Cypress.Commands.add('getCurrentUser', () => {
    return new Promise((resolve, reject) => {
      const user = firebase.auth().currentUser;
      if (user) {
        resolve(user);
      } else {
        reject(user);
      }
    });
  });

  /**
   * Log out of Firebase instance
   * @memberOf Cypress.Chainable#
   * @type {Cypress.Command}
   * @name cy.logout
   * @example
   * cy.logout()
   */
  Cypress.Commands.add('logout', () => {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(auth => {
        if (!auth) {
          resolve();
        }
      });
      firebase
        .auth()
        .signOut()
        .catch(reject);
    });
  });

  /**
   * Call Real Time Database path with some specified action. Authentication is through FIREBASE_TOKEN since firebase-tools is used (instead of firebaseExtra).
   * @param {String} action - The action type to call with (set, push, update, remove)
   * @param {String} actionPath - Path within RTDB that action should be applied
   * @param {Object} opts - Options
   * @param {Array} opts.args - Command line args to be passed
   * @name cy.callRtdb
   * @type {Cypress.Command}
   * @example <caption>Set Data</caption>
   * const fakeProject = { some: 'data' }
   * cy.callRtdb('set', 'projects/ABC123', fakeProject)
   * @example <caption>Set Data With Meta</caption>
   * const fakeProject = { some: 'data' }
   * // Adds createdAt and createdBy (current user's uid) on data
   * cy.callRtdb('set', 'projects/ABC123', fakeProject, { withMeta: true })
   * @example <caption>Get/Verify Data</caption>
   * cy.callRtdb('get', 'projects/ABC123')
   *   .then((project) => {
   *     // Confirm new data has users uid
   *     cy.wrap(project)
   *       .its('createdBy')
   *       .should('equal', Cypress.env('TEST_UID'))
   *   })
   * @example <caption>Other Args</caption>
   * const opts = { args: ['-d'] }
   * const fakeProject = { some: 'data' }
   * cy.callRtdb('update', 'project/test-project', fakeProject, opts)
   */
  Cypress.Commands.add('callRtdb', (action, actionPath, data, opts = {}) => {
    // If data is an object, create a copy to original object is not modified
    const dataToWrite = isObject(data) ? { ...data } : data;

    // Add metadata to dataToWrite if specified by options
    if (isObject(data) && opts.withMeta) {
      dataToWrite.createdBy = Cypress.env('TEST_UID');
      dataToWrite.createdAt = firebase.database.ServerValue.TIMESTAMP;
    }

    // Build command to pass to firebase-tools-extra
    const rtdbCommand = buildRtdbCommand(
      Cypress,
      action,
      actionPath,
      dataToWrite,
      opts
    );
    cy.log(`Calling RTDB command:\n${rtdbCommand}`);

    // Call firebase-tools-extra command
    return cy.exec(rtdbCommand).then(out => {
      const { stdout, stderr } = out || { stdout: null, stderr: null };
      // Reject with Error if error in rtdbCommand call
      if (stderr) {
        cy.log(`Error in Firestore Command:\n${stderr}`);
        return Promise.reject(stderr);
      }

      // Parse result if using get action so that data can be verified
      if (action === 'get' && typeof stdout === 'string') {
        try {
          return JSON.parse(stdout);
        } catch (err) {
          cy.log('Error parsing data from callRtdb response', out);
          return Promise.reject(err);
        }
      }

      // Otherwise return unparsed output
      return stdout;
    });
  });

  /**
   * Call Firestore instance with some specified action. Authentication is through serviceAccount.json since it is at the base
   * level. If using delete, auth is through `FIREBASE_TOKEN` since firebase-tools is used (instead of firebaseExtra).
   * @param {String} action - The action type to call with (set, push, update, remove)
   * @param {String} actionPath - Path within RTDB that action should be applied
   * @param {Object} opts - Options
   * @param {Array} opts.args - Command line args to be passed
   * @name cy.callFirestore
   * @type {Cypress.Command}
   * @example <caption>Basic</caption>
   * cy.callFirestore('add', 'project/test-project', 'fakeProject.json')
   * @example <caption>Recursive Delete</caption>
   * const opts = { recursive: true }
   * cy.callFirestore('delete', 'project/test-project', opts)
   * @example <caption>Other Args</caption>
   * const opts = { args: ['-r'] }
   * cy.callFirestore('delete', 'project/test-project', opts)
   */
  Cypress.Commands.add(
    'callFirestore',
    (action, actionPath, data, opts = {}) => {
      // If data is an object, create a copy to original object is not modified
      const dataToWrite = isObject(data) ? { ...data } : data;

      // Add metadata to dataToWrite if specified by options
      if (isObject(data) && opts.withMeta) {
        if (!dataToWrite.createdBy) {
          dataToWrite.createdBy = Cypress.env('TEST_UID');
        }
        if (!dataToWrite.createdAt) {
          dataToWrite.createdAt = new Date().toISOString();
        }
      }

      const firestoreCommand = buildFirestoreCommand(
        Cypress,
        action,
        actionPath,
        dataToWrite,
        opts
      );

      cy.log(`Calling Firestore command:\n${firestoreCommand}`);

      return cy.exec(firestoreCommand, { timeout: 100000 }).then(out => {
        const { stdout, stderr } = out || { stdout: null, stderr: null };
        // Reject with Error if error in firestoreCommand call
        if (stderr) {
          cy.log(`Error in Firestore Command:\n${stderr}`);
          return Promise.reject(stderr);
        }

        // Parse result if using get action so that data can be verified
        if (action === 'get' && typeof stdout === 'string') {
          try {
            return JSON.parse(stdout);
          } catch (err) {
            cy.log('Error parsing data from callFirestore response', out);
            return Promise.reject(err);
          }
        }

        // Otherwise return unparsed output
        return stdout;
      });
    }
  );
}

/**
 * Build Command to run Real Time Database action. All commands call
 * firebase-tools directly, so FIREBASE_TOKEN must exist in environment.
 * @param  {String} action - action to run on Firstore (i.e. "add", "delete")
 * @param  {String} actionPath - Firestore path where action should be run
 * @param  {String|Object} fixturePath - Path to fixture. If object is passed,
 * it is used as options.
 * @param  {Object} [opts={}] - Options object
 * @param  {Object} opts.args - Extra arguments to be passed with command
 * @return {String} Command string to be used with cy.exec
 */
function buildRtdbCommand(Cypress, action, actionPath, fixturePath, opts = {}) {
  const options: any = isObject(fixturePath) ? fixturePath : opts;
  const args = options.args || [];
  const argsWithDefaults = addDefaultArgs(Cypress, args);
  const argsStr = getArgsString(argsWithDefaults);
  // Add preceding slash if it doesn't already exist (required by firebase-tools)
  const cleanActionPath = actionPath.startsWith('/')
    ? actionPath
    : `/${actionPath}`;
  switch (action) {
    case 'remove':
      return `${FIREBASE_TOOLS_BASE_COMMAND} database:${action} ${cleanActionPath}${argsStr}`;
    case 'delete':
      return `${FIREBASE_TOOLS_BASE_COMMAND} database:remove ${cleanActionPath}${argsStr}`;
    case 'get': {
      const getDataArgsWithDefaults = addDefaultArgs(Cypress, args, {
        disableYes: true
      });
      if (options.limitToLast) {
        const lastCount = isBoolean(options.limitToLast)
          ? 1
          : options.limitToLast;
        if (!options.orderByChild) {
          getDataArgsWithDefaults.push(
            `--order-by-key --limit-to-last ${lastCount}`
          );
        } else {
          getDataArgsWithDefaults.push(
            `--order-by-child ${options.orderByChild} --limit-to-last ${lastCount}`
          );
        }
      }
      const getDataArgsStr = getArgsString(getDataArgsWithDefaults);
      return `${FIREBASE_TOOLS_BASE_COMMAND} database:${action} ${cleanActionPath}${getDataArgsStr}`;
    }
    default: {
      return `${FIREBASE_TOOLS_BASE_COMMAND} database:${action} ${cleanActionPath} -d '${JSON.stringify(
        options
      )}'${argsStr}`;
    }
  }
}

/**
 * Build Command to run Firestore action. Commands call either firebase-extra
 * (in bin/firebaseExtra.js) or firebase-tools directly. FIREBASE_TOKEN must
 * exist in environment if running commands that call firebase-tools.
 * @param  {String} action - action to run on Firstore (i.e. "add", "delete")
 * @param  {String} actionPath - Firestore path where action should be run
 * @param  {String|Object} fixturePath - Path to fixture. If object is passed,
 * it is used as options.
 * @param  {Object} [opts={}] - Options object
 * @param  {Object} opts.args - Extra arguments to be passed with command
 * @return {String} Command string to be used with cy.exec
 */
function buildFirestoreCommand(
  Cypress,
  action,
  actionPath,
  fixturePath,
  opts = {}
) {
  const options: any = isObject(fixturePath) ? fixturePath : opts;
  const args = options.args || [];
  const argsWithDefaults = addDefaultArgs(Cypress, args, { disableYes: true });
  switch (action) {
    case 'delete': {
      const deleteArgsWithDefaults = addDefaultArgs(Cypress, args);
      // Add -r to args string (recursive) if recursive option is true otherwise specify shallow
      const finalDeleteArgs = deleteArgsWithDefaults.concat(
        options.recursive ? '-r' : '--shallow'
      );
      const deleteArgsStr = getArgsString(finalDeleteArgs);
      return `${FIREBASE_TOOLS_BASE_COMMAND} firestore:${action} ${actionPath}${deleteArgsStr}`;
    }
    case 'set': {
      // Add -m to argsWithDefaults string (meta) if withmeta option is true
      return `${FIREBASE_EXTRA_PATH} firestore ${action} ${actionPath} '${JSON.stringify(
        fixturePath
      )}'${options.withMeta ? ' -m' : ''}`;
    }
    default: {
      // Add -m to argsWithDefaults string (meta) if withmeta option is true
      if (options.withMeta) {
        argsWithDefaults.push('-m');
      }
      return `${FIREBASE_EXTRA_PATH} firestore ${action} ${actionPath} '${JSON.stringify(
        fixturePath
      )}'`;
    }
  }
}

/**
 * Add default Firebase arguments to arguments array.
 * @param {Array} args - arguments array
 * @param  {Object} [opts={}] - Options object
 * @param {Boolean} [opts.disableYes=false] - Whether or not to disable the
 * yes argument
 */
function addDefaultArgs(Cypress, args, opts: any = {}) {
  const disableYes = !!opts.disableYes;
  const newArgs = [...args];
  // TODO: Load this in a way that understands environment. Currently this will
  // go to the first project id that is defined, not which one should be used
  // for the specified environment
  const projectId =
    Cypress.env('firebaseProjectId') ||
    Cypress.env('FIREBASE_PROJECT_ID') ||
    Cypress.env('STAGE_FIREBASE_PROJECT_ID');
  // Include project id command so command runs on the current project
  if (!newArgs.includes('-P') || !newArgs.includes(projectId)) {
    newArgs.push('-P');
    newArgs.push(projectId);
  }
  // Add Firebase's automatic approval argument if it is not already in newArgs
  if (!disableYes && !newArgs.includes(FIREBASE_TOOLS_YES_ARGUMENT)) {
    newArgs.push(FIREBASE_TOOLS_YES_ARGUMENT);
  }
  return newArgs;
}

/**
 * Create command arguments string from an array of arguments by joining them
 * with a space including a leading space. If no args provided, empty string
 * is returned
 * @param  {Array} args - Command arguments to convert into a string
 * @return {String} Arguments section of command string
 */
function getArgsString(args) {
  return args && args.length ? ` ${args.join(' ')}` : '';
}
