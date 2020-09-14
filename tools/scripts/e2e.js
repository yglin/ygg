const fs = require('fs');
const { entries } = require('lodash');
const spawn = require('child-process-promise').spawn;
var args = process.argv.slice(2);
var project = args[0];
var rootDir = process.cwd();
var projectDir = `${rootDir}/apps/${project}`;
var envDir = `${rootDir}/.env`;

async function run(command, args, options) {
  args = args || [];
  options = options || {};
  options.stdio = 'inherit';
  try {
    const fullCommand = `${command} ${args.join(' ')}`;
    console.log(`=====  Run command Begin: ${fullCommand}`);
    if (options.env) {
      console.log(
        `Environment Variables:\n${entries(options.env)
          .map(entry => entry.join(' = '))
          .join('\n')}`
      );
    }
    await spawn(command, args, options);
    console.log(`=====  Run command Success: ${fullCommand}\n\n`);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function runPreScript(scriptPath, options) {
  return new Promise((resolve, reject) => {
    fs.stat(scriptPath, async (err, stats) => {
      if (err === null) {
        console.log(`===== Found pre-script ${scriptPath}`);
        await run(scriptPath, [], options);
        resolve();
      } else {
        console.warn(`===== Pre-script ${scriptPath} not exsit.`);
        resolve();
      }
    });
  });
}

async function main() {
  // await run('npx', ['cypress-firebase', 'createTestEnvFile'], {
  //   cwd: projectDir
  // });
  
  // Point enviroments to project's environments json
  const projectTarget = project.replace(/-e2e/g, '');
  await run('ln', ['-fs', `${projectTarget}/environments.local.json`, `environments.json`], {cwd: envDir})

  await runPreScript(`${projectDir}/pre-e2e.sh`, {
    cwd: projectDir
  });

  const options = {};

  // Connect to Firebase Emulators
  const firebaseJSON = require('../../firebase.json');
  const databasePort = firebaseJSON.emulators.database.port;
  const firestorePort = firebaseJSON.emulators.firestore.port;
  const env = Object.create(process.env);
  env.FIREBASE_DATABASE_EMULATOR_HOST = `localhost:${databasePort}`;
  env.FIRESTORE_EMULATOR_HOST = `localhost:${firestorePort}`;
  options.env = env;

  await run('ng', ['e2e'].concat(args), options);
}

main();
