const spawn = require('child-process-promise').spawn;
var args = process.argv.slice(2);
var project = args[0];
var rootDir = process.cwd();

async function run(command, args, options) {
  args = args || [];
  options = options || {};
  options.stdio = 'inherit';
  try {
    const fullCommand = `${command} ${args.join(' ')}`;
    console.log(`============  Run command Begin: ${fullCommand}`);
    await spawn(command, args, options);
    console.log(`============  Run command Success: ${fullCommand}\n\n`);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function main() {
  await run('npx', ['cypress-firebase', 'createTestEnvFile'], {
    cwd: `${rootDir}/apps/${project}`
  });
  await run('ng', ['e2e'].concat(args));
}

main();
