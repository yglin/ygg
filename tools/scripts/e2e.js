const fs = require('fs');
const spawn = require('child-process-promise').spawn;
var args = process.argv.slice(2);
var project = args[0];
var rootDir = process.cwd();
var projectDir = `${rootDir}/apps/${project}`;

async function run(command, args, options) {
  args = args || [];
  options = options || {};
  options.stdio = 'inherit';
  try {
    const fullCommand = `${command} ${args.join(' ')}`;
    console.log(`=====  Run command Begin: ${fullCommand}`);
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
        console.log(`===== Found pre-script ${scriptPath}`)
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
  await runPreScript(`${projectDir}/pre-e2e.sh`, {
    cwd: projectDir
  });
  await run('ng', ['e2e'].concat(args));
}

main();
