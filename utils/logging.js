const loggingSystem = require('../db/db_log');

/* wrapper function to print error */
function perror(user, err) {

  /* change font to red, print err */
  console.error('\x1b[31m' + err);

  /* print trace */
  console.trace();

  /* store a JSON object as error */
  user.cause = err;
  loggingSystem.log_error(user);

  /* reset color */
  console.log('\x1b[0m');
}

/* wrapper function to throw fatal err */
function fatal(user, err) {
  console.error('\x1b[30m\x1b[44m' + err);

  /* store a JSON object as fatal */
  user.cause = err;
  loggingSystem.log_fatal(user);

  console.log('\x1b[0m');
}

/* wrapper function to throw fatal err */
function warning(user, err) {
  console.warn('x1b[43m' + err);

  /* store a JSON object as warning */
  user.cause = err;
  loggingSystem.log_warning(user);

  console.log('\x1b[0m');
}

/* wrapper function to print value */
function info(user, value) {

  /* write without newline */
  process.stdout.write('\x1b[33m');

  /* change font to yellow, print value, and reset font color */
  console.info(value);

  /* store a JSON object as info */
  user.cause = value;
  loggingSystem.log_info(user);

  /* write without newline */
  process.stdout.write('\x1b[0m');
}

/* wrapper function to print general logs */
function log(user, log) {
  /* change font to cran*/
  process.stdout.write('\x1b[36m');

  /* print value */
  console.log(log);

  /* reset font color */
  process.stdout.write('\x1b[0m');
}

module.exports = {
  perror : perror,
  fatal : fatal,
  warning : warning,
  info : info,
  log : log,
}
