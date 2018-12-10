/*
 * Author: Dr NewCoco
 * date: 12 dec 2018
 * Create and export the configuration variables
 * NODE_ENV=dev node index.js
 */

var environments = {};
environments.dev = {
  httpPort : 3000,
  //httpsPort : 3001,
  envName:'dev'
};

environments.production = {
  httpPort : 5000,
  //httpsPort : 5001,
  envName:'production'
};

//given a command line such as NODE_ENV=dev node index.js, return the required environment
var currEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//if the supplied environment is not defined, default to 'dev'
var exportEnv = typeof(environments[currEnv]) == 'object' ? environments[currEnv] : environments.dev;
module.exports = exportEnv;
