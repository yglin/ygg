const fs = require('fs');
const { extend, defaultsDeep } = require('lodash');

const args = process.argv.slice(2);
const project = args[0];
const target = args[1];
const rootDir = process.cwd();
const envPath = `${rootDir}/.env/${project}/environments.${target}.json`;
const envDefaultPath = `${rootDir}/.env/${project}/environments.default.json`;
const envWritePath = `${rootDir}/.env/environments.json`;

function main() {
  var targetEnv = {};
  if (fs.existsSync(envPath)) {
    targetEnv = JSON.parse(fs.readFileSync(envPath));
  } else {
    throw new Error(`Not found env file ${envPath}`);
  }
  var defaultEnv = {};
  if (fs.existsSync(envDefaultPath)) {
    defaultEnv = JSON.parse(fs.readFileSync(envDefaultPath));
  } else {
    console.warn(`Not found default env ${envDefaultPath}`);
  }
  var writeEnv = defaultsDeep(targetEnv, defaultEnv);
  fs.writeFileSync(envWritePath, JSON.stringify(writeEnv, null, 2));
}

main();