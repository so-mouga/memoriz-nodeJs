const logger = require('./logger');
const fs = require('fs');
const dotenv = require('dotenv');

let env;
switch (process.env.NODE_ENV) {
  case 'staging':
    env = '.env.staging';
    break;
  case 'production':
    env = '.env.production';
    break;
  default:
    if (fs.existsSync('.env')) {
      env = '.env';
    } else if (fs.existsSync('.env.example')) {
      env = '.env.example';
    } else {
      logger.error('No env file found');
      process.exit(1);
    }
}
if (!fs.existsSync(env) && fs.existsSync('.env.example')) {
  logger.debug(`${env} not found`);
  env = '.env.example';
}
logger.debug(`Using ${env} file to supply config environment variables`);
dotenv.config({ path: env });

exports.PORT = process.env.PORT;
