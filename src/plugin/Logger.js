'use strict';

const chalk = require('chalk');
const moment = require('moment');

/**
 * Log
 */
class Logger {
  /**
    * Log type log
    * @static
    * @param  {...any} args
    * @return {*}
    */
  static log(...args) {
    return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: ${
      chalk.bgBlue('log')} ${args}`);
  };
  /**
    * Log type error
    * @static
    * @param  {...any} args
    * @return {*}
    */
  static error(...args) {
    return console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: ${
      chalk.bgRed('error')} ${args}`);
  };
  /**
    * Log type error
    * @static
    * @param  {...any} args
    * @return {*}
    */
  static warn(...args) {
    return console.warn(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: ${
      chalk.black.bgYellow('warn')} ${args}`);
  };
  /**
    * Log type error
    * @static
    * @param  {...any} args
    * @return {*}
    */
  static debug(...args) {
    return console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: ${
      chalk.green('debug')} ${args}`);
  };
};

module.exports = Logger;
